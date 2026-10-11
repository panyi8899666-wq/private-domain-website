# 个人私域建设综合网站 V1

兼职广告设计师的线上获客门户：**物料专业度展示 + 在线下单（外链支付）+ 个人介绍**。

- 技术栈：**Astro（静态站点）** + **Tailwind CSS v4** + @astrojs/sitemap + sharp
- 运行方式：纯静态站点，无后端、无数据库、无登录、无支付代码（支付全部外链第三方）
- 4 个页面：`/`（首页） `/material`（物料百科） `/works`（作品集） `/order`（下单页）

## 快速开始

```bash
npm install
npm run dev      # 本地开发 http://localhost:4321
npm run build    # 构建静态产物到 dist/
npm run preview  # 本地预览 dist/
```

## 目录说明（开发者视角）

```
content/                          # ★ 设计师唯一需要维护的目录（改文件 = 改网站）
├── site.json                     # 全站通讯录：站名/微信号/二维码/外链/SEO
├── home.json                     # 首页全部文案与卡片
├── works.json                    # 作品分类 + 作品条目
├── order.json                    # 下单页：问卷地址/小商店地址/流程文案
├── materials/                    # 物料百科数据（发光字/灯箱/喷绘/印刷）
├── guide-改内容教学.md            # 面向小白的改内容教程（随站发布）
└── 资源授权清单.md                # 免费商用授权登记表
src/
├── pages/                        # 4 个页面（路由即文件名）
├── layouts/BaseLayout.astro      # 全站骨架（导航/页脚/悬浮按钮/SEO）
├── components/                   # 区块组件（见 design.md §2.6.6）
├── lib/content.ts                # 统一数据读取层
└── styles/global.css             # Tailwind 入口 + 设计令牌 + 发光工具类
public/                           # 运行期静态资源（图片/二维码/robots）
astro.config.mjs                  # Astro 配置（静态输出 + sitemap）
```

## 设计师指南

请阅读 `content/guide-改内容教学.md`：改首页文案、换二维码/微信号、增删作品、改物料数据、改下单外链，全部通过修改 `content/` 下的 JSON 完成，**无需懂代码**。

## 部署

全站零成本托管，只需要 5 步：

1. 注册 GitHub 账号，并新建一个空仓库（名字随意，如 `private-domain-website`）；
2. 把本项目的代码上传（push）到 GitHub 仓库；
3. 注册 Cloudflare 账号，进入「Pages」并「连接 GitHub」选择刚上传的仓库；
4. 按提示填写构建配置：构建命令 `npm run build`，输出目录 `dist`，然后点「保存并部署」；
5. 等待约 1~2 分钟，即可通过自动生成的 `https://xxxx.pages.dev` 域名访问网站。

> 构建配置：构建命令 `npm run build`，输出目录 `dist`，推送 `main` 分支自动发布。
> 面向新手的**逐步骤图文操作指引**见 `docs/部署指南-GitHub与Cloudflare.md`（打开就能照着做）。

> 需求与设计依据：`.codeartsdoer/specs/private-domain-website/` 下的 `spec.md`（REQ-001~039）、`design.md`、`tasks.md`。