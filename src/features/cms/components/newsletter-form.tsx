"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextInput } from "@/components/ui/text-input";
import type { CmsNewsletter } from "@/features/cms/lib/content";

type NewsletterFormProps = {
  content: CmsNewsletter;
};

export function NewsletterForm({ content }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");
    setMessage("");

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).catch(() => null);

    if (!response?.ok) {
      const payload = (await response?.json().catch(() => null)) as {
        error?: string;
      } | null;
      setStatus("error");
      setMessage(payload?.error || content.errorMessage);
      return;
    }

    setStatus("success");
    setMessage(content.successMessage);
    setEmail("");
  }

  return (
    <Card className="bg-slate-950 text-white">
      <h2 className="text-3xl font-semibold tracking-tight">{content.title}</h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
        {content.description}
      </p>
      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={handleSubmit}
      >
        <div className="flex-1">
          <TextInput
            type="email"
            label=""
            placeholder={content.inputPlaceholder}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-slate-500 focus:bg-slate-900"
          />
        </div>
        <Button type="submit" disabled={status === "pending"}>
          {content.buttonLabel}
        </Button>
      </form>
      {status !== "idle" && message ? (
        <p
          className={`mt-4 text-sm ${
            status === "success" ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {message}
        </p>
      ) : null}
    </Card>
  );
}
