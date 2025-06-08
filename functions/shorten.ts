import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://@admin:admin@localhost:27017";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const URLSchema = new mongoose.Schema({
  url: String,
  hash: String,
});
const URLModel = mongoose.model("URL", URLSchema);

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
  mongoose.connect(MONGO_URI);
  const body = await req.json();
  const url = body.url;
}
