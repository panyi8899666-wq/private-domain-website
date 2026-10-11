/**
 * 内联 SVG 图标白名单（design §2.7.1 图标方案，免费商用）
 * 来源：Lucide（ISC/MIT 许可）图标集，作为内联 SVG 源码入仓，零网络请求。
 * 使用时按白名单 icon 名取用；home.json.services[].icon 只能填这些键。
 */

const ICONS: Record<string, string> = {
  'pen-tool':
    '<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
  box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  spray:
    '<path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="m13 14 8-2"/><path d="m17 13 3.7 6"/>',
  'file-print':
    '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  wechat:
    '<path d="M8.7 4C5 4 2 6.5 2 9.6c0 1.7.9 3.3 2.3 4.3l-.6 1.9c-.1.3.2.6.5.4l2.1-1.3c.8.2 1.6.3 2.4.3.3 0 .6 0 .9-.1-.1-.5-.1-1 0-1.5 0-2.7 2.4-4.8 5.4-4.8h.4C14.6 5.8 11.9 4 8.7 4zM6.4 7.6c.7 0 1.2.5 1.2 1.2S7 10 6.4 10s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2zm4.6 0c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2zM22 14.4c0-2.6-2.6-4.7-5.8-4.7s-5.8 2.1-5.8 4.7 2.6 4.7 5.8 4.7c.7 0 1.4-.1 2-.3l1.8 1.1c.3.2.6-.1.5-.4l-.5-1.6c1.3-.9 2-2 2-3.5zm-7.7-.6c-.6 0-1-.5-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm3.8 0c-.6 0-1-.5-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>',
  external:
    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
};

export type IconName = keyof typeof ICONS;

/** 返回带统一外壳的 SVG 字符串（fill=none / stroke=currentColor） */
export function iconSvg(
  name: IconName | string,
  size = 24,
  filled = false
): string {
  const inner = ICONS[name] ?? ICONS['box'];
  const fill = filled ? 'currentColor' : 'none';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${filled ? 'none' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

/** 是否白名单图标（用于 content 校验提示） */
export function isIconAllowed(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(ICONS, name);
}