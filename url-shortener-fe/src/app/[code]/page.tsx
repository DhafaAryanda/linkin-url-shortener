"use client";

import NotFound from "next/error";
import { redirect } from "next/navigation";

export default async function Page(data: any) {
  let params = await data.params;

  const BACKEND_SERVER =
    process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:3000";
  let originalUrl = await fetch(`${BACKEND_SERVER}/api/expand`, {
    method: "POST",
    body: JSON.stringify({ hashCode: params.code }),
  }).then((res) => res.json());

  if (originalUrl.code != 200) {
    return <NotFound statusCode={404} />;
  }

  redirect(originalUrl.data);
}
