#!/usr/bin/env node
/**
 * 占位图生成脚本（开发期使用）
 *
 * 生成 V1 开发所需的全部占位图：
 *  - public/images/hero/bg.svg                 首页 Hero 背景
 *  - public/images/materials/*.svg             百科配图（light-char/spray/print/placeholder）
 *  - public/images/works/w001~w010.svg         作品占位图
 *  - public/images/works/placeholder.svg       作品兜底图
 *  - public/images/qr/wechat.png               微信二维码占位图（600×600 PNG，长边≥400 达标 REQ-004）
 *
 * 均为自研生成的轻量占位资源（免费商用），正式素材替换见 content/资源授权清单.md。
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PUBLIC = join(ROOT, 'public');

function ensureDir(rel) {
  mkdirSync(join(PUBLIC, rel), { recursive: true });
}

/* ---------------- SVG 生成 ---------------- */

function svgWrap(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1A2332"/>
      <stop offset="100%" stop-color="#0B0F14"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="none" stroke="#3EC6FF" stroke-opacity="0.35" stroke-width="1.5" rx="12"/>
  ${body}
</svg>
`;
}

/** 占位图：深色工业风 + 中央发光文字标注 */
function svgPlaceholder(w, h, title, subtitle = '占位图 · 待替换') {
  const body = `
  <text x="50%" y="46%" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="${Math.round(w / 12)}" font-weight="700" fill="#3EC6FF" style="text-shadow:0 0 18px rgba(62,198,255,.65)">${title}</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="${Math.round(w / 22)}" fill="#5C6B7E">${subtitle}</text>`;
  return svgWrap(w, h, body);
}

/* ---------------- PNG 生成（二维码占位） ---------------- */

// CRC32（PNG 必需）
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0; // filter: none
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))]);
}

/**
 * 生成「模拟二维码」占位图：三个定位角（finder pattern）+ 伪随机数据块。
 * 仅作占位，不具备真实扫码能力；正式上线前必须替换为设计师真实微信二维码。
 */
function makeQRPlaceholder(size = 600) {
  const rgba = Buffer.alloc(size * size * 4);
  // 全白底
  for (let i = 0; i < size * size; i++) {
    rgba[i * 4] = 255;
    rgba[i * 4 + 1] = 255;
    rgba[i * 4 + 2] = 255;
    rgba[i * 4 + 3] = 255;
  }
  const n = 29; // 模块数
  const pad = 34;
  const cell = Math.floor((size - pad * 2) / n);

  const draw = (mx, my) => {
    const x0 = pad + mx * cell;
    const y0 = pad + my * cell;
    for (let y = 0; y < cell; y++) {
      for (let x = 0; x < cell; x++) {
        const px = x0 + x;
        const py = y0 + y;
        if (px < 0 || py < 0 || px >= size || py >= size) continue;
        const idx = (py * size + px) * 4;
        rgba[idx] = 12;
        rgba[idx + 1] = 24;
        rgba[idx + 2] = 40;
        rgba[idx + 3] = 255;
      }
    }
  };

  const inFinder = (mx, my) =>
    (mx < 7 && my < 7) || (mx >= n - 7 && my < 7) || (mx < 7 && my >= n - 7);

  // 三个定位角
  for (let mx = 0; mx < n; mx++) {
    for (let my = 0; my < n; my++) {
      if (!inFinder(mx, my)) continue;
      const dx = mx < 7 ? mx : mx - (n - 7);
      const dy = my < 7 ? my : my - (n - 7);
      const border = dx === 0 || dx === 6 || dy === 0 || dy === 6;
      const center = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
      if (border || center) draw(mx, my);
    }
  }

  // 数据区伪随机块（固定种子，保证每次生成一致）
  let seed = 20261011;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let mx = 0; mx < n; mx++) {
    for (let my = 0; my < n; my++) {
      if (inFinder(mx, my)) continue;
      if (rand() > 0.56) draw(mx, my);
    }
  }
  return encodePNG(size, size, rgba);
}

/* ---------------- 输出 ---------------- */

const works = [
  ['w001', '发光字门头'],
  ['w002', '吸塑灯箱招牌'],
  ['w003', '易拉宝展架'],
  ['w004', '菜单画册'],
  ['w005', '药房门头'],
  ['w006', '户外喷绘'],
  ['w007', '形象墙字'],
  ['w008', '产品画册'],
  ['w009', '活动展架'],
  ['w010', '灯箱招牌'],
];

// Hero 背景（1200×800）
ensureDir('images/hero');
writeFileSync(join(PUBLIC, 'images/hero/bg.svg'), svgPlaceholder(1200, 800, '广告物料制作', '门头招牌 · 发光字 · 喷绘 · 印刷'));

// 物料配图（800×600）
ensureDir('images/materials');
writeFileSync(join(PUBLIC, 'images/materials/light-char.svg'), svgPlaceholder(800, 600, '发光字', '厚度/材质/光源/寿命'));
writeFileSync(join(PUBLIC, 'images/materials/spray.svg'), svgPlaceholder(800, 600, '喷绘写真', '室内写真 vs 户外喷绘'));
writeFileSync(join(PUBLIC, 'images/materials/print.svg'), svgPlaceholder(800, 600, '印刷品', '克重与常见尺寸'));
writeFileSync(join(PUBLIC, 'images/materials/placeholder.svg'), svgPlaceholder(800, 600, '图片加载失败', '请检查图片路径'));

// 作品图（800×600）
ensureDir('images/works');
for (const [id, name] of works) {
  writeFileSync(join(PUBLIC, `images/works/${id}.svg`), svgPlaceholder(800, 600, name, `${id} 作品占位图`));
}
writeFileSync(join(PUBLIC, 'images/works/placeholder.svg'), svgPlaceholder(800, 600, '图片加载失败', '请检查图片路径'));

// 微信二维码占位图（600×600 PNG，长边=600 ≥ 400，REQ-004 达标）
ensureDir('images/qr');
writeFileSync(join(PUBLIC, 'images/qr/wechat.png'), makeQRPlaceholder(600));

console.log('✅ 占位图生成完成：');
console.log('  - images/hero/bg.svg');
console.log('  - images/materials/*.svg × 4');
console.log('  - images/works/*.svg × 11');
console.log('  - images/qr/wechat.png（600×600 模拟二维码占位，正式上线前请替换为真实微信二维码）');