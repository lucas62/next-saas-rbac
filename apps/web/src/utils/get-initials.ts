export function getInitials(
  fullName: string | undefined | null,
  fallback = '?',
): string {
  if (!fullName?.trim()) return fallback

  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word: string) => word[0].toUpperCase())
    .join('')
}
