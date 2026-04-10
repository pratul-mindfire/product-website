import { NextResponse } from "next/server";

import { subscribeEmail } from "@/server/newsletter/subscribers";

type SubscribeRequest = {
  email?: string;
};

export async function POST(request: Request) {
  const body = (await request
    .json()
    .catch(() => null)) as SubscribeRequest | null;
  const email = body?.email ?? "";
  const result = await subscribeEmail(email);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
