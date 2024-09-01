export function slugify(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase()
}
