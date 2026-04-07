export type Theme = 'dark' | 'light'

export const themeStorageKey = 'fearlab-theme'

export const detectInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey)
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  if (storedTheme === 'day') {
    return 'light'
  }

  return 'dark'
}

export const toggleTheme = (theme: Theme): Theme => (theme === 'dark' ? 'light' : 'dark')
