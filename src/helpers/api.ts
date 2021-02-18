import * as url from 'url'

export const getHostnameFromUrl = (u: string): string | null => {
  if (typeof u === 'string') {
    const parsed = url.parse(u, true)
    return parsed?.hostname ?? null
  }
  return null
}
