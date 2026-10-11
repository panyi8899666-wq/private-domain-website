# 部署指南：把你的网站免费放到网上（GitHub + Cloudflare Pages）

> 写给完全没有技术经验的新手。**照着手册一步步点，30 分钟内就能让你的网站上线，全程 0 元**。
> 这份手册会带你做三件事：
> 1. 把电脑里的网站代码上传到 GitHub（相当于放到一个免费的网络保险柜）；
> 2. 到 Cloudflare 点几下，让它在云端自动帮你把网站"盖"出来；
> 3. 拿到一个免费的 `xxxx.pages.dev` 网址，以后改内容只需按 3 条命令，网站自动更新。

---

## 开始之前：你只需要准备 3 样东西

| 需要 | 是什么 | 花钱吗 |
| --- | --- | --- |
| ① 项目文件夹 | 就是 `/Users/pan/Downloads/个人私域建设`，已经准备好了 | 不花 |
| ② GitHub 账号 | 放代码的免费网站 | 免费 |
| ③ Cloudflare 账号 | 帮你免费建站、免费给域名的网站 | 免费 |

> 📱 全程用电脑（macOS）操作，推荐使用电脑自带的「终端」应用完成上传，最不容易出错。
> 如果你完全不想碰终端，手册第一部分也准备了「纯网页上传」的备用方法。

---

## 第一部分：把代码上传到 GitHub

### 第 1 步｜注册 GitHub 账号（约 5 分钟，只需一次）

1. 浏览器打开：https://github.com
2. 点右上角 **「Sign up」**（注册）；
3. 按提示填：邮箱 → 设置密码（至少 8 位）→ 给自己起一个**用户名**；
   - ⚠️ 用户名会出现在以后的网址里（`github.com/你的用户名/...`），建议用全英文，比如 `designer-pan`；
   - 注册页会让你验证是不是真人，点一个图形或输一串字母即可；
4. 完成后，去邮箱点 GitHub 发给你的验证链接（**「Verify email address」**）；
5. 回 GitHub 登录，能看到首页就说明注册好了。

### 第 2 步｜在 GitHub 上新建一个空仓库（约 2 分钟）

仓库 = 一个专门装你代码的文件夹（在云端）。

1. 登录后点 GitHub 页面右上角的 **「+」** → 选 **「New repository」**；
2. 在 **「Repository name」** 里输入仓库名字：`private-domain-website`（和项目同名，方便认）；
3. **「Public」** 保持选中（公有，免费；私人仓库以后要收费）；
4. ⚠️ 重要：**不要勾选**「Add a README file」「Add .gitignore」「Choose a license」这三项——我们代码里都有，勾了反而容易冲突；
5. 点绿色按钮 **「Create repository」**；
6. 创建后会跳到「Quick setup」页面，**先别关这个页面**，第 3 步要用它上面的网址。

### 第 3 步｜上传代码（二选一，推荐方法一）

#### 方法一（推荐）：用「终端」上传 —— 3 分钟搞定 ✅

**打开终端**：点屏幕右上角放大镜 🧐 → 输入「终端」→ 回车打开。会看到一个黑底白字的窗口，下面所有代码都是一行一行复制进去的，**每次粘贴一行后按回车**。

先把下面这段复制进终端（这一段的中间带有中文路径，所以整行用**引号**包住，直接原样复制即可）：

```bash
cd "/Users/pan/Downloads/个人私域建设"
```

按回车后，如果没报错，说明已经进入项目文件夹了。

再执行下面这行，告诉 git 你是谁（**把引号里的内容换成你自己的 GitHub 用户名和注册邮箱**）：

```bash
git config user.name "你的GitHub用户名"
git config user.email "你的GitHub邮箱"
```

> 💡 把两个引号中间的文字换掉，例如：`git config user.name "designer-pan"`。搞不清就先照抄，以后想改随时能改。

接下来，把本地项目和刚才建好的 GitHub 空仓库"接上线"（**把网址里的 `你的用户名` 换成你的 GitHub 用户名**）：

```bash
git remote add origin https://github.com/你的用户名/private-domain-website.git
```

最后，上传（第一次上传用下面这一行）：

```bash
git push -u origin main
```

如果终端显示类似 `main -> main` 和 `done.` 的字样，就是上传成功了！🎉

#### 方法二：纯网页上传（不上终端也能传，但不如方法一爽快）

> 适用场景：不想开终端。缺点是网页一次拖太多文件容易卡，所以只推荐在文件不多时用。**用方法一成功的朋友请直接跳到第 4 步。**

1. 打开你的 GitHub 仓库页面（就是第 2 步那个 `github.com/你的用户名/private-domain-website`）；
2. 点页面上的 **「uploading an existing file」** 链接（或点 **「Add file」** → **「Upload files」**）；
3. 把你 Mac 上项目文件夹里的**所有内容**拖进网页的虚线框里（要包含那些子文件夹，如 `content`、`src`、`public`、`package.json` 等）；
   - ⚠️ 别拖这些文件夹：`node_modules`、`dist`、`.astro`、`.git`（它们是垃圾文件/自动生成文件，不需要上传）；
   - macOS 的 Finder 如果默认不显示隐藏文件，可以先按 `Command + Shift + .`（句号）把隐藏文件显示出来，再逐个拖。
4. 拖完后，在最下面的「Commit changes」栏里写一句话，比如 `上传网站代码`，然后点绿色按钮 **「Commit changes」**；
5. 等它转圈完成，就能在仓库页面看到文件了。

### 第 4 步｜检查上传成功没有

1. 打开你的仓库页面并刷新；
2. 应该能看到 `content/`、`src/`、`public/`、`package.json`、`README.md` 等文件和文件夹；
3. **确认看不到** `node_modules` 和 `dist` 文件夹（它们已被 `.gitignore` 自动忽略，这是正常的，别担心）。

✅ 到这里，代码已经在 GitHub 上了。接下来去 Cloudflare 把它变成网站。

---

## 第二部分：用 Cloudflare Pages 把网站"盖"出来

### 第 1 步｜注册 / 登录 Cloudflare（免费）

1. 浏览器打开：https://dash.cloudflare.com/sign-up
2. 填邮箱、密码，点 **「Sign up」**；
3. 去邮箱点验证链接激活；
4. 激活后进入面板，第一次会问你要不要选套餐，**直接选免费版**（Free），正常进入主界面即可。

### 第 2 步｜进入 Pages、新建项目

1. 登录 Cloudflare 后，在左侧菜单找到 **「Workers & Pages」**，点进去；
2. 页面上方找到 **「Pages」** 标签并点击；
3. 点页面中间的 **「Create」**（或 **「Create application」**）；
4. 在弹出的画面里选 **「Pages」** → 点 **「Connect to Git」**。

### 第 3 步｜把 GitHub 账号授权给 Cloudflare（只需一次）

1. Cloudflare 会带你跳到 GitHub 的授权页面，点 **「Authorize Cloudflare」**（允许）；
2. 如果 Cloudflare 没显示你的仓库，点 **「Install」** 旁边的齿轮图标，把仓库权限给 Cloudflare（勾选 All repositories 最简单）；
3. 回到 Cloudflare，在仓库列表里找到 `private-domain-website`，点右边的 **「Begin setup」**（开始设置）。

### 第 4 步｜填写「构建配置」（关键一步，仔细照抄）

进入设置页后，看到「**Build settings**」（构建配置）区域，照着填：

| 设置项 | 填什么 | 说明 |
| --- | --- | --- |
| Framework preset | 选 **Astro**（如果列表里没有，就选 **None**） | 让 Cloudflare 知道用什么方式打包 |
| Build command | `npm run build` | 打包命令，原样复制 |
| Build output directory | `dist` | 打包完的网站文件放在哪里 |

再往下，把「**Environment variables**」（环境变量）展开，添加一条：

| Key | Value |
| --- | --- |
| `NODE_VERSION` | `20` |

> 💡 `NODE_VERSION` 可以让 Cloudflare 用新版 Node.js 来打包，避免 Astro 5 因为版本太旧而报错。加上它最稳妥。

**其他设置一概不用动**，直接点下面的绿色按钮 **「Save and Deploy」**（保存并部署）。

### 第 5 步｜等待部署完成（1~2 分钟）

1. 点完后页面会转到「Deployments」（部署记录）页面，能看到一条正在运行的记录，前面有个小圆圈在转；
2. 大概 1~2 分钟后，圆圈变成 **✅ 绿色的对勾**，就说明部署成功了；
3. 部署成功后，页面上方会显示一个网址：`https://xxxx.pages.dev`（`xxxx` 是一串系统自动生成的英文，比如 `private-domain-website`）；
4. 点网址旁边的 **「Visit site」**（或自己复制网址到浏览器打开），看到你的网站首页，就大功告成！🎉🎉🎉

> 这个 `xxxx.pages.dev` 就是你的**免费域名**，可以发给别人访问，也可以发到朋友圈、印在名片上。**免备案，不用向任何部门登记。**

---

## 第三部分：你的域名 & 以后怎么更新发布

### 你的免费域名

- 每次打开 Cloudflare → **「Workers & Pages」** → **「Pages」** → 点击你的 `private-domain-website` 项目，页面「Production」下面就是你的网址；
- 想要更好记，可以回到项目设置里改「Project name」（项目名），项目名就是 `pages.dev` 网址开头的部分。

### 以后改内容、改完怎么发布（3 条命令）

以后你只需要改 `content/` 文件夹里的文字和 `public/` 文件夹里的图片（具体怎么改，看 `content/guide-改内容教学.md`）。

改完之后，打开「终端」，依次复制这 3 行（不要求每次都记住，**看到这份手册照抄就行**）：

```bash
cd "/Users/pan/Downloads/个人私域建设"
git add .
git commit -m "更新网站内容"
git push
```

- 第 1 行：进入项目文件夹（有中文路径所以加了引号，照抄即可）；
- 第 2 行：把所有改动"打包"；
- 第 3 行：**上传到 GitHub**。

然后**等 1~2 分钟**，Cloudflare 检测到 GitHub 有更新，会自动重新构建并发布，你的网站就更新了。**全程不用自己在电脑上执行 npm run build**（构建是在云上自动完成的）。

> 💡 刷新网页看不到新内容？99% 是浏览器缓存，强制刷新：`Command + Shift + R`。

### 可选的进阶操作（不着急，上线后慢慢来）

1. **把 astro.config.mjs 里的占位域名换成你的真实域名**（可选）：
   - 项目里 `astro.config.mjs` 和 `public/robots.txt` 目前写着占位网址 `https://private-domain-website.pages.dev`；
   - 如果你部署出来的网址前缀**正好也叫** `private-domain-website`（Cloudflare 默认用的就是它），那什么都不用改；
   - 如果网址前缀不一样，以后可以打开这两个文件，把占位网址改成你实际得到的 `https://你的前缀.pages.dev`，再执行上面 3 条命令发布即可（此操作纯属锦上添花，不影响网站显示）。
2. **绑定自己花钱买的域名**：等将来买了个性域名（如 `designerpan.com`，一年几十块），可以在 Pages 项目 → **「Custom domains」** 里填域名并跟随提示改 DNS。**不买域名完全不影响使用**，`pages.dev` 免费域名够用。

---

## 第四部分：常见问题（FAQ）

### Q1：执行 `git push` 时提示 "Please tell me who you are"
**原因**：电脑还没告诉 git 你的身份。
**解决**：先执行这两行（换成你自己的用户名和邮箱），再重新 `git push`：
```bash
git config user.name "你的GitHub用户名"
git config user.email "你的GitHub邮箱"
```

### Q2：`git push` 报错 "! [rejected] ... (fetch first)" 或 "refusing to merge unrelated histories"
**原因**：GitHub 网站上的空仓库里被你勾选加进了 README 之类的文件，和本地文件"接不上"。
**解决（二选一）**：
- 最省事：回到 GitHub，把这个仓库删掉重新建一个（页面 **「Settings」→ 拉到底 →「Danger Zone」→「Delete this repository」**），建的时候**千万别勾选**任何初始化选项，然后重试 `git push -u origin main`；
- 或者强行合并：执行 `git pull origin main --allow-unrelated-histories` 后，再执行 `git push -u origin main`。

### Q3：为什么 GitHub 仓库里没有 `node_modules` 文件夹？
**正常现象，别慌**。`node_modules` 是几万个自动生成的依赖文件，`.gitignore` 把它和 `dist`、`.astro` 都屏蔽了不准上传。Cloudflare 部署时会在云端自己重新下载依赖，不需要你传。

### Q4：push 时提示文件太大 / 上传失败
- GitHub 限制**单个文件不能超过 100 MB**；
- 先确认自己没有把 `node_modules` 传上去（它里面单文件可能超限）——它本来就不该传，删除本地这个文件夹也**不会**影响项目，Cloudflare 会自动重新安装；
- 如果你传了超大的视频/设计原稿文件，把大文件移出项目目录、或压缩后再放进去。

### Q5：部署失败了怎么办？怎么查看部署日志？
1. 打开 Cloudflare → **「Workers & Pages」** → **「Pages」** → 点你的项目；
2. 点 **「Deployments」** 标签，找到标红 ✖ 的那一次记录；
3. 点它的 **「View build log」**（查看构建日志）看详细原因；
4. 最常见的失败原因是：改 `content/` 的 JSON 时多打了逗号、少写了引号，或图片路径写错。改回正确的再 `git push` 重试即可。
5. ⚠️ **安心**：构建失败时，线上网站会**继续沿用上一个成功版本**，不会白屏，你的访客看不到失败现场。

### Q6：网站打不开 / 提示无法访问 / 一直转圈
按顺序排查：
1. **部署完了吗？** 网页部署中（圆圈转）是不一定能访问的，等 1~2 分钟变绿 ✓ 再试；
2. **网址对吗？** 完整网址是 `https://你的前缀.pages.dev`，记得带 `https://`；
3. **是缓存吗？** 强制刷新：`Command + Shift + R`；
4. **换个网络试试**：`pages.dev` 是国内可访问的免费域名（免备案），但个别网络环境偶尔抽风，换手机流量（4G/5G）打开通常就好；
5. 以上都不行，看 Q5 查部署日志，确认是否构建失败。

### Q7：这个方案真的不花钱吗？以后会不会突然收费？
- GitHub 公有仓库、Cloudflare Pages 免费方案，**对个人正常使用都是永久免费**；
- 免费套餐每月有流量额度（Pages 免费额度非常充足，个人设计作品站根本用不完）；
- 只有当你的网站流量巨大到一定程度（每月几百万访客级别），才可能需要考虑升级——对现在的你来说不用担心。

### Q8：手机或别人的电脑能访问吗？
可以。把你的 `xxxx.pages.dev` 网址发过去，手机上直接打开就能看，不需要装任何东西。

---

## 部署全流程速查卡（贴墙版）

```
① 改内容（content/ 下 JSON 或 public/ 图片）
        ↓
② 终端执行 3 行命令：
   cd "/Users/pan/Downloads/个人私域建设"
   git add .
   git commit -m "更新内容"    ← 引号里随便写，说明你改了啥
   git push
        ↓
③ 等 1~2 分钟
        ↓
④ 打开 xxxx.pages.dev 查看，看不到就 Command+Shift+R 强刷
```

祝你上线顺利，接单多多！🚀