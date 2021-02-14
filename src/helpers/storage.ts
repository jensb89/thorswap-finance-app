import { ThemeType } from '@thorchain/asgardex-theme'

const THEME_TYPE = 'THEME_TYPE'

export const saveTheme = (themeType: ThemeType) => {
  localStorage.setItem(THEME_TYPE, themeType)
}

export const getTheme = (): ThemeType => {
  return (localStorage.getItem(THEME_TYPE) as ThemeType) || ThemeType.LIGHT
}
