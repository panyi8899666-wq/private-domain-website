// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// 站点域名占位：部署到 Cloudflare Pages 后替换为真实域名（见 tasks.md 12.3）
const SITE = 'https://private-domain-website.pages.dev';

export default defineConfig({
  // 纯静态输出（REQ-029）：产物为 dist/ 静态文件，无服务端依赖
  output: 'static',
  site: SITE,
  integrations: [
    // 构建自动产出 sitemap-index.xml（REQ-036）
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !/\/api\//.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // 占位图等大资源不触发警告刷屏
      assetsInlineLimit: 0,
    },
  },
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});