"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { TextInput } from "@/app/components/ui/text-input";
import type { CmsNewsletter } from "@/app/features/cms/lib/content";

type NewsletterFormProps = {
  content: CmsNewsletter;
};

export function NewsletterForm({ content }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const subscribeMutation = useMutation({
    mutationFn: async (nextEmail: string) => {
      const response = await axios.post<{ ok: true }>("/api/subscribe", {
        email: nextEmail,
      });

      return response.data;
    },
    onSuccess: () => {
      setMessage(content.successMessage);
      setEmail("");
    },
    onError: (error) => {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setMessage(error.response?.data?.error || content.errorMessage);
        return;
      }

      setMessage(content.errorMessage);
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    subscribeMutation.mutate(email);
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
        <Button type="submit" disabled={subscribeMutation.isPending}>
          {content.buttonLabel}
        </Button>
      </form>
      {message ? (
        <p
          className={`mt-4 text-sm ${
            subscribeMutation.isSuccess ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {message}
        </p>
      ) : null}
    </Card>
  );
}
