export function slugify(text: string): string {
  if (!text) return ''
  return text.substring(0, 3).toUpperCase()
}
