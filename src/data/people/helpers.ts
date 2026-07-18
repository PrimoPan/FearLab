export const tidyWebsite = (value: string): string | undefined => {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const url = new URL(normalized)

    if (url.hostname.includes('linkedin')) {
      const path = url.pathname.replace(/^\/+/, '')

      url.protocol = 'https:'
      url.hostname = 'www.linkedin.com'
      url.pathname = url.pathname.startsWith('/in/')
        ? url.pathname
        : path
          ? `/in/${path.replace(/^in\//, '')}`
          : '/in/'
      url.search = ''
      url.hash = ''
    }

    return url.toString()
  } catch {
    return normalized
  }
}

export const paragraphs = (value: string): string[] =>
  value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
