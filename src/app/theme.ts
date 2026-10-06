export type Theme = 'dark' | 'light'

export const detectInitialTheme = (): Theme => 'dark'

export const toggleTheme = (theme: Theme): Theme => (theme === 'dark' ? 'light' : 'dark')
