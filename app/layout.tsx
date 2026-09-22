import type { Metadata } from "next";
import "./globals.css";

// Metadata API 会自动注入导出的元数据对象
export const metadata: Metadata = {
  title: "Prisflow",
  description: "Prisflow 平台门户：产品矩阵入口",
  referrer: "no-referrer",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}.site-header .header-inner{opacity:1 !important;pointer-events:auto !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
