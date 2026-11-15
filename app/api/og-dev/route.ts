// TEMPORARY (dev only) — writes the generated OG card to disk. Deleted after use.
import { writeFileSync } from "node:fs";
import path from "node:path";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("not available", { status: 404 });
  }
  const buf = Buffer.from(await req.arrayBuffer());
  writeFileSync(path.join(process.cwd(), "app", "opengraph-image.png"), buf);
  writeFileSync(path.join(process.cwd(), "app", "twitter-image.png"), buf);
  return new Response("ok");
}
