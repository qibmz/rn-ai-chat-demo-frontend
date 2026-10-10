/** 从邮箱提取展示名（@ 前一段） */
export function getDisplayNameFromEmail(email?: string | null): string {
  if (!email) return '用户';
  const local = email.split('@')[0]?.trim();
  return local || '用户';
}

/** 头像 fallback 用的 1–2 位字母 */
export function getAvatarInitials(email?: string | null): string {
  const name = getDisplayNameFromEmail(email);
  const parts = name
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, ' ')
    .trim()
    .split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (/[\u4e00-\u9fff]/.test(parts[0])) {
    return parts[0].slice(0, 1);
  }
  if (parts.length >= 2 && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}
