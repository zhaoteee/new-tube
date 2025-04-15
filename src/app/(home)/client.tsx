"use client";

import { trpc } from "@/trpc/client";

export default function PageClient() {
  const [data, res] = trpc.hello.useSuspenseQuery({ text: "zhaote" });
  if (res.error) {
    debugger;
    throw res.error;
  }
  return <div>Page client says: {data.greeting}</div>;
}
