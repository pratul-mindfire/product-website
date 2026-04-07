import type { Metadata } from "next";
import { APP_METADATA } from "@/constants/app";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_METADATA.title,
  description: APP_METADATA.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
