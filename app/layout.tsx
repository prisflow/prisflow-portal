import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISFLOW // PLATFORM",
  description: "Prisflow 平台门户：产品矩阵入口",
  referrer: "no-referrer",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}