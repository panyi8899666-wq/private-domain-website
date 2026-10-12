/**
 * 统一数据读取层（design §2.4.3 / tasks.md 3.1）
 *
 * - 用 import.meta.glob 并行读取 content/**​/*.json
 * - 统一过滤所有 `_` 前缀注释键（design §2.5.1 原则 2）
 * - 深合并内置默认值：content 字段缺失/删除时页面仍可渲染而非白屏（REQ-024 容错）
 * - 必填校验并在缺失时开发日志告警
 * - 导出类型化视图：site / home / materials / works / order，供 4 个页面调用
 *
 * 模块级缓存：ES 模块单例天然只解析一次，二次调用不重复解析。
 */
import type {
  SiteConfig,
  HomeConfig,
  WorksConfig,
  OrderConfig,
  MaterialData,
} from './types';

type Rec = Record<string, unknown>;

/* ------------------------------------------------------------------ *
 * 读取 content 目录下的全部 JSON（构建期一次性并行加载）
 * ------------------------------------------------------------------ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modules = import.meta.glob('../../content/**/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Rec>;

/* ------------------------------------------------------------------ *
 * 工具：过滤 `_` 前缀注释键 / 深合并 / 日志
 * ------------------------------------------------------------------ */
/** 递归过滤所有 `_` 前缀注释键，返回纯净数据（不污染渲染） */
function stripComments<T>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map((item) => stripComments(item)) as unknown as T;
  }
  if (input !== null && typeof input === 'object') {
    const out: Rec = {};
    for (const [key, value] of Object.entries(input as Rec)) {
      if (key.startsWith('_')) continue; // 丢弃注释键
      out[key] = stripComments(value);
    }
    return out as T;
  }
  return input as T;
}

/** 深合并：override 覆盖 base，对象递归合并、数组/标量直接替换 */
function deepMerge(base: Rec, override: Rec | undefined): Rec {
  const out: Rec = { ...base };
  if (!override) return out;
  for (const [key, value] of Object.entries(override)) {
    const baseValue = out[key];
    if (
      value && typeof value === 'object' && !Array.isArray(value) &&
      baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue)
    ) {
      out[key] = deepMerge(baseValue as Rec, value as Rec);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** 开发期日志：仅 import.meta.env.DEV 时输出，避免污染生产日志 */
function devWarn(message: string): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[content] ${message}`);
  }
}

/** 读取单个 JSON 文件：取名 → 过滤注释 → 深合并默认值 */
function readJson<T>(fileName: string, defaults: T): T {
  const key = Object.keys(modules).find((k) => {
    const norm = k.replace(/\\/g, '/');
    return norm === `../../content/${fileName}` || norm.endsWith(`/${fileName}`);
  });
  if (!key) {
    devWarn(`缺少 content/${fileName}，已用内置默认值兜底。`);
    return defaults;
  }
  const raw = stripComments<Rec>(modules[key]) ?? {};
  return deepMerge(defaults as unknown as Rec, raw) as unknown as T;
}

/* ------------------------------------------------------------------ *
 * 内置默认值（content 字段缺失/删除时兜底，保证不白屏）
 * ------------------------------------------------------------------ */
const DEFAULT_SITE: SiteConfig = {
  siteName: '潘工·广告物料制作',
  slogan: '10年广告物料老匠人，发光字·喷绘·印刷一站式',
  wechat: { wechatId: '17306983179', qrImage: '/images/qr/wechat.png', qrAlt: '扫码添加微信，免费咨询报价' },
  contact: { phone: '', location: '', serviceHours: '' },
  social: {
    storeUrl: 'https://your-store.example.com',
    surveyUrl: 'https://wj.qq.com/example-survey',
    surveyFallbackUrl: 'https://wj.qq.com/example-survey-fallback',
  },
  seo: { defaultKeywords: '广告设计,物料制作,发光字,喷绘写真,印刷品,门头招牌' },
  footerCopyright: '© 潘工·广告物料制作 版权所有',
};

const DEFAULT_HOME: HomeConfig = {
  hero: {
    badge: '广告物料一站式服务',
    title: '门头招牌 · 发光字 · 喷绘写真 · 印刷',
    subtitle: '免费测量、免费设计、免费报价',
    primaryCtaText: '免费咨询报价',
    primaryCtaHref: '/order',
    secondaryCtaText: '加微信聊聊',
    backgroundImage: '/images/hero/bg.svg',
  },
  services: {
    items: [
      { name: '广告设计', icon: 'pen-tool', desc: 'logo/海报/画册设计', href: '/material#fashezi' },
      { name: '物料制作', icon: 'box', desc: '发光字、灯箱、门头招牌', href: '/material#fashezi' },
      { name: '喷绘写真', icon: 'spray', desc: '室内写真、户外喷绘', href: '/material#penhui' },
      { name: '印刷品', icon: 'file-print', desc: '铜版纸、卡纸、相纸印制', href: '/material#yinshua' },
    ],
  },
  materialPreview: {
    cards: [
      { title: '发光字', summary: '厚度/材质/光源/寿命', image: '/images/materials/light-char.svg', href: '/material#fashezi', ctaText: '看发光字参数' },
      { title: '喷绘写真', summary: '室内 vs 户外一表看清', image: '/images/materials/spray.svg', href: '/material#penhui', ctaText: '看喷绘对照' },
      { title: '印刷品', summary: '克重与尺寸对照', image: '/images/materials/print.svg', href: '/material#yinshua', ctaText: '看印刷对照' },
    ],
  },
  worksPreview: { count: 6 },
  process: {
    steps: [
      { step: '01', title: '咨询', desc: '加微信/填表说明需求' },
      { step: '02', title: '报价', desc: '确认方案后快速给到报价' },
      { step: '03', title: '制作', desc: '按单生产进度可查' },
      { step: '04', title: '交付', desc: '送货安装/快递发货' },
    ],
    ctaText: '立即开始咨询 / 下单',
    ctaHref: '/order',
  },
};

const DEFAULT_WORKS: WorksConfig = {
  categories: [
    { id: 'mentou', name: '门头' },
    { id: 'zhaopai', name: '招牌' },
    { id: 'zhanjia', name: '展架' },
    { id: 'huace', name: '画册' },
  ],
  items: [],
};

const DEFAULT_ORDER: OrderConfig = {
  pageTitle: '下单与咨询',
  intro: '加微信发需求，1 对 1 报价；全程微信沟通，无需问卷或第三方店铺。',
  form: {
    embedUrl: 'https://wj.qq.com/example-survey',
    fallbackUrl: 'https://wj.qq.com/example-survey-fallback',
    fallbackText: '打不开问卷？点这里直接填写需求表',
    iframeTitle: '需求登记表',
  },
  store: { title: '添加微信直接下单', url: 'https://your-store.example.com', note: '微信沟通确认需求与报价，微信转账支付，无第三方平台' },
  process: {
    steps: [
      { step: '01', title: '提交需求', desc: '微信留言：类型/尺寸/数量/位置' },
      { step: '02', title: '确认报价', desc: '免费出方案与报价' },
      { step: '03', title: '支付定金', desc: '微信沟通确认后支付，可留收据与记录' },
      { step: '04', title: '制作生产', desc: '按工艺标准生产' },
      { step: '05', title: '交付验收', desc: '配送安装/验收结款' },
    ],
  },
};

const EMPTY_MATERIAL: MaterialData = {
  id: '',
  title: '',
  intro: '',
  ctaText: '报价咨询',
  ctaHref: '/order',
  params: undefined,
  categories: undefined,
  columns: undefined,
  rows: undefined,
};

/* ------------------------------------------------------------------ *
 * 导出类型化视图（tasks.md 3.1：二次调用不重复解析 = 模块级缓存）
 * ------------------------------------------------------------------ */
export const site: SiteConfig = readJson<SiteConfig>('site.json', DEFAULT_SITE);

export const home: HomeConfig = readJson<HomeConfig>('home.json', DEFAULT_HOME);

export const works: WorksConfig = readJson<WorksConfig>('works.json', DEFAULT_WORKS);

export const order: OrderConfig = readJson<OrderConfig>('order.json', DEFAULT_ORDER);

/** 物料百科：四份数据统一读取（data 先于页面渲染，供 material.astro 使用） */
export const materials: Record<string, MaterialData> = {
  fashezi: readJson<MaterialData>('materials/fashezi.json', EMPTY_MATERIAL),
  dengxiang: readJson<MaterialData>('materials/dengxiang.json', EMPTY_MATERIAL),
  penhui: readJson<MaterialData>('materials/penhui.json', EMPTY_MATERIAL),
  yinshua: readJson<MaterialData>('materials/yinshua.json', EMPTY_MATERIAL),
};

/* ------------------------------------------------------------------ *
 * 必填校验（tasks.md 3.1）：缺失值输出「待确认」并开发日志告警
 * ------------------------------------------------------------------ */
function validateMaterials(): void {
  const fashezi = materials.fashezi;
  if (fashezi.params && fashezi.params.length >= 8) {
    for (const p of fashezi.params) {
      if (!p.value || !p.value.trim()) {
        p.value = '待确认';
        devWarn('materials/fashezi.json 存在空 value，已填充「待确认」。');
      }
    }
  } else {
    devWarn('materials/fashezi.json 参数不足 8 项（REQ-012），缺少：厚度/材质/工艺/光源/功率/寿命/适用场景/价格区间。');
  }

  const penhui = materials.penhui;
  if (penhui.rows && penhui.rows.length >= 4) {
    for (const row of penhui.rows) {
      for (const v of Object.values(row)) {
        if (!v || !String(v).trim()) {
          devWarn('materials/penhui.json 存在空单元格（REQ-014 每格不能留空）。');
        }
      }
    }
  } else {
    devWarn('materials/penhui.json 行数不足 4（REQ-014 需 材质厚度/分辨率/防雨防晒/用途 4 维度）。');
  }

  const yinshua = materials.yinshua;
  if (!yinshua.rows || yinshua.rows.length < 4) {
    devWarn('materials/yinshua.json 行数不足 4（REQ-015 需 铜版纸/卡纸/相纸/不干胶 4 类材质）。');
  }
}

/**
 * order 兜底直链与小商店外链字段：当前页面已不引用（微信直联），
 * 字段保留仅防类型缺失；如缺失则静默使用默认占位值（不阻断渲染）。
 */
function validateOrder(): void {
  // 注：embedUrl/fallbackUrl/store.url 字段仍存在于 schema，但页面已不渲染。
  // 保留占位值即可通过；如以后开通问卷/小商店可填回并恢复组件渲染。
}

/** works 分类归属校验：非法 category 归入「其他」（避免渲染错乱） */
function validateWorks(): void {
  const ids = new Set(works.categories.map((c) => c.id));
  for (const item of works.items) {
    if (!item.category || !ids.has(item.category)) {
      devWarn(`作品 ${item.id} 的 category「${item.category}」不存在于 categories，已归入「其他」。`);
      item.category = 'other';
    }
  }
}

validateMaterials();
validateOrder();
validateWorks();

/* ------------------------------------------------------------------ *
 * 派生数据：首页作品预览（REQ-009：先取 featured 再普通补齐，4~6 条）
 * ------------------------------------------------------------------ */
export function homeWorksPreview(): WorksConfig['items'] {
  const limit = Math.min(Math.max(home.worksPreview.count, 4), 6); // 约束为 4~6
  const featured = works.items.filter((w) => w.featured);
  const rest = works.items.filter((w) => !w.featured);
  // 保持去重（featured 集合 + 普通集合互斥，直接拼接即可）
  return [...featured, ...rest].slice(0, limit);
}

/** 分类名查询（作品卡片上展示中文标签） */
export function categoryName(id: string): string {
  return works.categories.find((c) => c.id === id)?.name ?? '其他';
}

/** 页面级公共可复用导出：当前全站站点名等 */
export function getSiteName(): string {
  return site.siteName;
}