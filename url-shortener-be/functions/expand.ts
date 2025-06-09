import Redis from "ioredis";
import { Config } from "../config/config";
import mongoose from "mongoose";
import { newResponse } from "../helper/response";

const config = Config();
const redisClient = new Redis(config.REDIS_URI);
mongoose.connect(config.MONGO_URI);

export async function POST(req: Request) {
  const body = await req.json();
  const hashCode = body.hashCode;

  const urlFromCache = await redisClient.get(hashCode);
  if (urlFromCache) {
    return newResponse({
      code: 200,
      data: urlFromCache,
    });
  }

  const urlFromDB = await config.URLModel.findOne({ hash: hashCode });
  if (urlFromDB) {
    return newResponse({
      code: 200,
      data: urlFromDB.url,
    });
  }

  return newResponse({
    code: 404,
    message: "URL not found",
  });
}
