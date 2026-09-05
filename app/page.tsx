"use client";

import { useEffect } from "react";

const PRODUCTS = [
  {
    id: "proactiveai",
    name: "PROACTIVEAI",
    tag: "AI CHAT ASSISTANT",
    description: "会自己切换上下文的 AI 聊天助手",
    version: "v0.6.1",
    host: "proactiveai.prisflow.com",
    url: "https://proactiveai.prisflow.com",
  },
  {
    id: "sqlense",
    name: "SQLENSE",
    tag: "SQL TEACHING",
    description: "数据库教学智能助手",
    version: "v1.0.0",
    host: "sqlense.prisflow.com",
    url: "https://sqlense.prisflow.com",
  },
];

export default function Home() {
  // 鼠标跟随微光：写入 CSS 变量，渲染层零 re-render
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div className="cursor-glow" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col px-6">
        {/* 顶栏 */}
        <header className="flex items-center justify-between border-b border-white/[0.07] py-5 text-[12px] tracking-[0.18em] text-white/60">
          <span>
            PRISFLOW <span className="text-white/45">//</span> PLATFORM
          </span>
          <span className="flex items-center gap-2.5">
            <span className="pulse-dot" />
            ALL SYSTEMS OPERATIONAL
          </span>
        </header>

        {/* 品牌区 */}
        <main className="flex flex-1 flex-col justify-center py-20">
          <h1 className="text-[clamp(2.8rem,9vw,6.5rem)] font-bold leading-none tracking-[0.28em] text-white select-none">
            PRISFLOW
          </h1>
          <p className="mt-6 text-sm text-white/60">
            棱流 平台 · 产品矩阵入口
            <span className="mx-3 text-white/20">/</span>
            <span className="text-[var(--color-accent)]">SELECT A PRODUCT TO CONTINUE</span>
          </p>

          {/* 产品入口卡 */}
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {PRODUCTS.map((p) => (
              <a key={p.id} href={p.url} className="portal-card group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] tracking-[0.22em] text-[var(--color-accent)]">
                    {p.tag}
                  </span>
                  <span className="card-arrow text-lg text-white/50">→</span>
                </div>
                <h2 className="mt-5 text-xl font-bold tracking-[0.12em] text-white">
                  {p.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {p.description}
                </p>
                <div className="mt-7 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[11px] text-white/50">
                  <span>{p.version}</span>
                  <span>{p.host}</span>
                </div>
              </a>
            ))}
          </div>
        </main>

        {/* 页脚 */}
        <footer className="flex items-center justify-between border-t border-white/[0.07] py-5 text-[11px] tracking-[0.12em] text-white/50">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white/60"
          >
            沪ICP备2026028440号
          </a>
          <a
            href="mailto:wangziyu@prisflow.cn"
            className="transition-colors hover:text-[var(--color-accent)]"
          >
            联系我们
          </a>
        </footer>
      </div>
    </>
  );
}