#!/bin/bash
# ============================================
#  一键更新网站
#  用途：把你在 content/ 里改动的内容，自动发布到网上
#  用法：在访达里双击本文件即可
# ============================================

# 加载 Node 环境（让 npm / wrangler / git 命令可用）
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="/opt/homebrew/bin:$PATH"

cd "/Users/pan/Downloads/个人私域建设" || {
  echo "❌ 找不到项目文件夹，可能被移动了。"
  read -n 1 -s -r -p "按任意键关闭..."
  exit 1
}

echo "========================================"
echo "  正在更新你的网站，请稍候..."
echo "========================================"
echo ""

# 1) 保存改动到 GitHub
echo "【1/3】保存改动..."
git add .
git commit -m "更新网站内容 $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo "（没有新改动，跳过）"
git push 2>/dev/null || echo "（GitHub 上传失败，可能是网络问题，稍后可重试）"

# 2) 重新构建网站
echo ""
echo "【2/3】重新生成网站..."
npm run build || {
  echo "❌ 构建失败！可能是内容文件写错了（比如 json 少了逗号）。"
  echo "   请把上面的报错发给我。"
  read -n 1 -s -r -p "按任意键关闭..."
  exit 1
}

# 3) 发布到 Cloudflare
echo ""
echo "【3/3】发布到网上..."
wrangler pages deploy dist --project-name=private-domain-website --branch=main --commit-dirty=true || {
  echo "❌ 发布失败，可能是网络问题，请稍后再双击一次。"
  read -n 1 -s -r -p "按任意键关闭..."
  exit 1
}

echo ""
echo "========================================"
echo "  ✅ 更新完成！"
echo "  网址：https://private-domain-website.pages.dev"
echo "  （等约 1 分钟生效，如没变化按 ⌘+Shift+R 刷新）"
echo "========================================"
echo ""
read -n 1 -s -r -p "按任意键关闭窗口..."