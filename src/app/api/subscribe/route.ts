import { NextResponse } from "next/server";

import { subscribeEmail } from "@/server/newsletter/subscribers";

type SubscribeRequestBody = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubscribeRequestBody;
    const result = await subscribeEmail(body.email ?? "");

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Subscription failed. Please try again." },
      { status: 500 },
    );
  }
}
