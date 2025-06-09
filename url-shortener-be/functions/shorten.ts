import mongoose from "mongoose";
import redis from "ioredis";
import { createHash, randomBytes } from "crypto";
import { Config } from "../config/config";
import { newResponse } from "../helper/response";

const config = Config();

const redisClient = new redis(config.REDIS_URI);
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

/**
 *
 * Request:
 * {
 *  "url": "<url-to-shorten>",
 * }
 *
 * Response:
 * {
 *  "code": 200,
 * "data": "<shortened-url>",
 * "message": "URL shortened successfully"
 * }
 *
 * @param req { Request }
 */

export async function POST(req: Request) {
  const body = await req.json();
  const url = body.url;

  const hasher = createHash("sha256");
  let hashCode = hasher
    .update(url)
    .digest("base64url")
    .substring(0, config.CODE_LENGTH);

  do {
    const urlFromCache = await redisClient.get(hashCode);
    if (urlFromCache != null) {
      if (urlFromCache == url) {
        return newResponse({
          code: 200,
          data: hashCode,
        });
      }
    }

    const urlExists = await config.URLModel.findOne({ hash: hashCode });

    if (!urlExists) {
      await config.URLModel.create({
        url: url,
        hash: hashCode,
      });
      await redisClient.set(hashCode, url);
      return newResponse({
        code: 200,
        data: hashCode,
      });
    }

    if (urlExists.url == url) {
      return newResponse({
        code: 200,
        data: hashCode,
      });
    }
    hashCode = hashCode + randomBytes(2).toString("base64url").charAt(0);
  } while (hashCode.length < config.MAX_CODE_LENGTH);
  return newResponse({
    code: 500,
    message: "overflow",
  });
}

export function OPTIONS(req: Request) {
  return new Response("OK", { status: 200 });
}
