"use client";

/**
 * Prisflow 平台门户 —— 「白之序」设计：
 * 白底严肃、居中 logo；滚动时 hero logo 沿"顶栏落点"位移缩小（动效围绕滚动后 logo 的相对位置），
 * 进入产品区时全页白⇄深色反转（唯一的颜色变换）；内容实、动效克制。
 */

import { useEffect, useRef } from "react";

interface Product {
  index: string;
  name: string;
  desc: string;
  specs: string[];
  version: string;
  url: string;
  ghost?: boolean;
}

const PRODUCTS: Product[] = [
  {
    index: "01",
    name: "ProactiveAI",
    desc: "会自己运转的 AI 伙伴。以对话为入口，向下扎根插件生态——上下文、工具、LLM Flow 三件套让每个插件自成世界；在对话里就能造出插件，然后直接能玩。",
    specs: ["对话造插件", "UI 推送组件库", "插件可导出分享", "Windows"],
    version: "v0.6.6",
    url: "https://proactiveai.prisflow.com",
  },
  {
    index: "02",
    name: "SQLense",
    desc: "数据库实验课智能教学平台。轻量级架构，一台 2C4G 服务器即可带班：为学生提供云端 IDE，为教师提供实时监控与 AI 智能分析。",
    specs: ["云端 IDE", "实时监控", "AI 智能分析", "Web"],
    version: "v1.0.0",
    url: "https://sqlense.prisflow.com",
  },
  {
    index: "03",
    name: "Next",
    desc: "更多产品孵化中。",
    specs: [],
    version: "SOON",
    url: "#",
    ghost: true,
  },
];

const PRINCIPLES = [
  { index: "01", title: "对话即入口", desc: "产品的复杂度留在引擎里，界面只剩一句话。" },
  { index: "02", title: "软件自己运转", desc: "能自动收拾的上下文、状态与流程，绝不交给用户。" },
  { index: "03", title: "数据归用户", desc: "存档、插件与密钥全部留在用户自己的设备上。" },
];

/** 官方棱形标记（黑白随当前主题，恢复自原始 icon） */
function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" aria-hidden>
      <path fill="currentColor" d="M507,270.9c17.5,0,34.5,0.2,51.5-0.1c5.1-0.1,7.7,1.8,10.2,6c34.7,60,69.6,119.9,104.3,179.8 c30.4,52.5,60.6,105,90.9,157.6c0.7,1.3,1.8,2.4,1.4,4.2c-1.5,1.5-3.4,0.9-5.1,0.9c-33.7,0-67.3-0.1-101,0 c-4,0-6.3-1.4-8.3-4.8c-29.5-50.7-59.1-101.3-88.7-151.9c-28.1-48-56.3-96-84.5-144c-8.3-14.1-16.5-28.1-24.8-42.2 c-0.7-1.3-1.3-2.6-2.7-5.5C469.6,270.9,488,270.9,507,270.9z" />
      <path fill="currentColor" d="M472,755.2c-44.2,0-87.9,0-131.3,0c-0.9-3,0.3-4.4,1.1-5.7c17.8-30.9,35.7-61.7,53.4-92.7 c2.2-3.8,5-4.1,8.7-4.1c123.6,0,247.3,0,371,0c3.8,0,7.6-0.5,11.2,0.4c0.9,1.7-0.2,2.8-0.8,3.9c-18.4,31.3-36.8,62.6-55,93.9 c-2.2,3.7-5,4.2-8.7,4.2C638.5,755.2,555.5,755.2,472,755.2z" />
      <path fill="currentColor" d="M376.2,623.1c-24.5,43.8-48.7,87.2-72.8,130.1c-2.6,0.3-3.2-1-3.9-2.1 c-19.4-31.3-38.8-62.6-58.3-93.8c-1.9-3-1.8-5.1-0.1-8.1c45.8-77.2,91.5-154.5,137.3-231.8c19.2-32.4,38.3-64.8,57.5-97.2 c0.7-1.1,1.6-2.1,2.3-3.1c2.3,0.3,2.7,2.1,3.5,3.5c17,29.2,33.9,58.5,51.1,87.7c1.8,3.1,0.8,5.2-0.6,7.8 c-17.6,31.4-35.2,62.8-52.8,94.2C418.3,547.8,397.3,585.3,376.2,623.1z" />
    </svg>
  );
}

export default function Home() {
  const heroBoxRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const headerLogoRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    // .matches 返回布尔值 代表用户是否开启了减少动效的偏好
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) html.classList.add("reduced");

    // ---- 滚动编排：hero logo 沿顶栏落点位移缩小；深浅反转由产品区是否过视口中线决定 ----
    // 存 raf 的 id，0 表示没有在排队的帧，用于做节流
    let raf = 0;
    // 把值限制在 0~1 
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        // 没有在排队的帧数
        raf = 0;
        // 已滚动的距离
        const s = window.scrollY;
        // 三个组件 ref
        const heroBox = heroBoxRef.current;
        const heroInner = heroInnerRef.current;
        const headerLogo = headerLogoRef.current;
        if (!heroBox || !heroInner || !headerLogo) return;

        // 用户没有开减少动效，执行动效逻辑
        if (!reduced) {
          // 兜底为 1，防止除以 0
          const heroH = heroBox.offsetHeight || 1;
          // 编排压缩在前 42% 滚动内完成，避免 logo 淡出后剩余大片空白，既 p 的进度从 0 到 1
          const p = clamp01(s / (heroH * 0.42));
          // 此时 heroBox 的视口几何对象
          const r = heroBox.getBoundingClientRect();
          // hero 中心的屏幕 y 坐标
          const heroCenterY = r.top + r.height / 2;
          // 顶栏 logo 中心的屏幕 y 坐标
          const headerCenterY =
            headerLogo.getBoundingClientRect().top + headerLogo.offsetHeight / 2;
          // 差值 * 进度 p
          const dy = (headerCenterY - heroCenterY) * p;
          // 放缩比计算
          const scale = 1 - 0.72 * p;
          // 动画驱动的容器，执行动效
          heroInner.style.transform = `translateY(${dy.toFixed(1)}px) scale(${scale.toFixed(3)})`;
          // hero logo 在抵达落点前就完全淡出（0.26h~0.42h），顶栏 logo 之后才出现——两者不同屏，杜绝重影
          const q = clamp01((s - heroH * 0.26) / (heroH * 0.16));
          // 淡出隐藏，在 0.26h 之前完全不透明
          heroInner.style.opacity = String(1 - q);
        }
        const heroH2 = heroBoxRef.current?.offsetHeight || 0;
        // 超过百分之四十四，用于切换深浅模式
        html.classList.toggle("header-on", s > heroH2 * 0.44);
        // 超过百分十二，用于隐藏下拉标志
        html.classList.toggle("hint-off", s > heroH2 * 0.12);
      });
    };

    // ---- 颜色变换：产品区覆盖视口中线时整页转深色，离开恢复 ----
    const darkIo = new IntersectionObserver(
      // 根据 entry.isIntersecting 的结果确定是否加上 dark-stage
      ([entry]) => html.classList.toggle("dark-stage", entry.isIntersecting),
      // 顺时针 上下压缩百分之四十二，只看视口中线
      { rootMargin: "-42% 0px -42% 0px" },
    );
    if (productsRef.current) darkIo.observe(productsRef.current);

    // ---- 入场 reveal：双 rAF 确保初态提交 ----
    // 所有带 data-reveal 属性的元素，返回的是 Nodelist
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    // 如果用户要求减少动效
    if (reduced) {
      // 一次性全部显示，不播放动画
      els.forEach((el) => el.classList.add("is-in"));
    } else {
      // 第一帧，先渲染出元素的初始状态
      requestAnimationFrame(() =>
        // 第二帧，再加上 is-in ，触发 transition 动画
        requestAnimationFrame(() => els.forEach((el) => el.classList.add("is-in"))),
      );
    }

    // 手动调用一次滚动触发
    onScroll();
    // { passive: true } 不会调用 preventDefault()，既不会终止滚动 浏览器不会等待回调，直接滚动更加丝滑
    window.addEventListener("scroll", onScroll, { passive: true });
    // 窗口大小也重新计算一次
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      darkIo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* 全局背景层：白⇄深反转在这里发生 */}
      <div className="bg-stage" aria-hidden />

      {/* 顶栏：logo 收拢后的落点（居中）+ 右侧导航 */}
      <header className="site-header">
        <div className="header-inner relative mx-auto flex h-[68px] max-w-6xl items-center justify-end px-6 md:px-10">
          <div
            ref={headerLogoRef}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
          >
            <Mark size={22} />
            <span className="text-[13px] font-semibold tracking-[0.28em]">PRISFLOW</span>
          </div>
          <nav className="flex items-center gap-6 text-xs text-muted">
            <a href="#products" className="transition-colors hover:text-ink">产品</a>
            <a href="#about" className="transition-colors hover:text-ink">关于</a>
          </nav>
        </div>
        <div className="header-line mx-auto h-px max-w-6xl bg-hairline" />
      </header>

      <main className="relative z-10">
        {/* Hero：居中 logo（满屏大留白） */}
        <section className="relative flex h-[100svh] min-h-[560px] flex-col items-center justify-center px-6">
          <div ref={heroBoxRef} className="flex flex-col items-center text-center">
            <div ref={heroInnerRef} className="hero-logo-inner flex flex-col items-center">
              <span data-reveal style={{ "--d": "0.05s" } as React.CSSProperties} className="text-ink">
                <Mark size={52} />
              </span>
              <h1
                data-reveal
                style={{ "--d": "0.18s" } as React.CSSProperties}
                className="mt-7 select-none text-4xl font-semibold tracking-[0.22em] text-ink md:text-6xl"
              >
                PRISFLOW
              </h1>
              <p
                data-reveal
                style={{ "--d": "0.3s" } as React.CSSProperties}
                className="mt-5 text-xs tracking-[0.42em] text-muted md:text-sm"
              >
                棱 流 平 台
              </p>
            </div>
          </div>

          {/* 滚动提示 */}
          <div data-reveal style={{ "--d": "0.6s" } as React.CSSProperties} className="scroll-hint absolute bottom-10 flex flex-col items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.34em] text-muted">SCROLL</span>
            <span className="hint-line block h-10 w-px bg-muted/60" />
          </div>
        </section>

        {/* 宣言 */}
        <section className="mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-40">
          <p data-reveal className="font-mono text-[11px] tracking-[0.3em] text-muted">
            宣言 / MANIFESTO
          </p>
          <h2
            data-reveal
            style={{ "--d": "0.1s" } as React.CSSProperties}
            className="mt-8 text-4xl font-medium tracking-tight text-ink md:text-6xl"
          >
            享受产品。
          </h2>
          <p
            data-reveal
            style={{ "--d": "0.2s" } as React.CSSProperties}
            className="mt-8 max-w-3xl text-sm leading-loose text-muted md:text-[15px]"
          >
            Prisflow 是一个 AI 应用探索平台——我们把复杂留给引擎，把界面留给一句话，把时间还给创造。
          </p>

          {/* 原则：纯文字三列，无卡片 */}
          <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-14">
            {PRINCIPLES.map((pr, i) => (
              <div key={pr.index} data-reveal style={{ "--d": `${0.1 + i * 0.08}s` } as React.CSSProperties}>
                <p className="font-mono text-[11px] text-muted">{pr.index}</p>
                <h3 className="mt-3 text-base font-semibold text-ink">{pr.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{pr.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 产品：深色区（滚动至此全页反转） */}
        <section ref={productsRef} id="products" className="mx-auto max-w-6xl px-6 py-28 text-white md:px-10 md:py-40">
          <div data-reveal className="flex items-baseline justify-between">
            <p className="font-mono text-[11px] tracking-[0.3em] text-white/50">产品 / PRODUCTS</p>
            <p className="font-mono text-[11px] tracking-[0.2em] text-white/50">02 + 1 孵化中</p>
          </div>

          <div className="mt-12">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.index}
                data-reveal
                style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
                className={`product-row py-12 md:py-16 ${p.ghost ? "opacity-40" : ""}`}
              >
                <div className="grid gap-6 md:grid-cols-[3.5rem_1fr_auto] md:gap-10">
                  <p className="font-mono text-sm text-white/40">{p.index}</p>
                  <div>
                    <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">{p.name}</h3>
                    <p className="mt-4 max-w-2xl text-sm leading-loose text-white/60 md:text-[15px]">
                      {p.desc}
                    </p>
                    {p.specs.length > 0 && (
                      <p className="mt-5 flex flex-wrap items-center text-xs text-white/45">
                        {p.specs.map((s) => (
                          <span key={s} className="spec-item">{s}</span>
                        ))}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <p className="font-mono text-xs text-white/50">{p.version}</p>
                    {!p.ghost && (
                      <a
                        href={p.url}
                        className="row-link font-mono text-xs tracking-[0.18em] text-white underline underline-offset-8"
                      >
                        访问 ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 关于 */}
        <section id="about" className="mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-40">
          <p data-reveal className="font-mono text-[11px] tracking-[0.3em] text-muted">
            关于 / ABOUT
          </p>
          <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-20">
            <h2
              data-reveal
              style={{ "--d": "0.1s" } as React.CSSProperties}
              className="text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl"
            >
              独立构建，
              <br />
              长期维护。
            </h2>
            <div data-reveal style={{ "--d": "0.2s" } as React.CSSProperties} className="space-y-5 text-sm leading-loose text-muted md:text-[15px]">
              <p>
                Prisflow 的每个产品都由同一套理念驱动：引擎承担复杂，界面保持简单，数据留在用户手中。
                产品矩阵覆盖个人 AI 伙伴与教育场景，仍在持续生长。
              </p>
              <p>
                我们发布缓慢但稳定——每个版本都经过真实的日常使用与多轮自动化验证，才值得你安装。
              </p>
            </div>
          </div>
        </section>

        {/* 页脚：居中 mini logo，呼应首屏 */}
        <footer className="border-t border-hairline">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center md:px-10">
            <span data-reveal className="text-ink">
              <Mark size={30} />
            </span>
            <p data-reveal style={{ "--d": "0.08s" } as React.CSSProperties} className="mt-4 text-[13px] font-semibold tracking-[0.28em] text-ink">
              PRISFLOW
            </p>
            <nav data-reveal style={{ "--d": "0.16s" } as React.CSSProperties} className="mt-6 flex items-center gap-7 text-xs text-muted">
              <a href="#products" className="transition-colors hover:text-ink">产品</a>
              <a href="#about" className="transition-colors hover:text-ink">关于</a>
              <a href="mailto:wangziyu@prisflow.cn" className="transition-colors hover:text-ink">联系我们</a>
            </nav>
            <div data-reveal style={{ "--d": "0.24s" } as React.CSSProperties} className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.14em] text-muted/70">
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-muted"
              >
                沪ICP备2026028440号
              </a>
              <span>© 2026 PRISFLOW</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
