/**
 * content 数据类型定义（design §2.5 数据模型）
 * 与 src/lib/content.ts 一一对应；修改 content JSON 结构时须同步本文件（约定 C-04）。
 */

export interface SiteConfig {
  siteName: string;
  slogan: string;
  wechat: { wechatId: string; qrImage: string; qrAlt: string };
  contact: { phone: string; location: string; serviceHours: string };
  social: { storeUrl: string; surveyUrl: string; surveyFallbackUrl: string };
  seo: { defaultKeywords: string };
  footerCopyright: string;
}

export interface HomeConfig {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    backgroundImage: string;
  };
  services: { items: Array<{ name: string; icon: string; desc: string; href: string }> };
  materialPreview: { cards: Array<{ title: string; summary: string; image: string; href: string; ctaText: string }> };
  worksPreview: { count: number };
  process: { steps: Array<{ step: string; title: string; desc: string }>; ctaText: string; ctaHref: string };
}

export interface WorksConfig {
  categories: Array<{ id: string; name: string }>;
  items: Array<{
    id: string;
    name: string;
    category: string;
    image: string;
    alt: string;
    note: string;
    featured: boolean;
  }>;
}

export interface OrderConfig {
  pageTitle: string;
  intro: string;
  form: { embedUrl: string; fallbackUrl: string; fallbackText: string; iframeTitle: string };
  store: { title: string; url: string; note: string };
  process: { steps: Array<{ step: string; title: string; desc: string }> };
}

/** 物料百科四份 JSON 共用结构（不同文件用到的可选字段不同） */
export interface MaterialData {
  id: string;
  title: string;
  intro: string;
  ctaText: string;
  ctaHref: string;
  /** 发光字八参数（fashezi.json） */
  params?: Array<{ name: string; value: string; note: string }>;
  /** 灯箱与标识字（dengxiang.json） */
  categories?: Array<{ type: string; scenes: string; craft: string; priceRange: string }>;
  /** 对照表（penhui.json / yinshua.json） */
  columns?: string[];
  rows?: Array<Record<string, string>>;
}