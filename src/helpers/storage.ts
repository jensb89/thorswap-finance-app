import { ThemeType } from '@thorchain/asgardex-theme'
import { Keystore } from '@xchainjs/xchain-crypto'
import { Asset } from 'multichain-sdk'

const THEME_TYPE = 'THEME_TYPE'
const ASGARDEX_KEYSTORE = 'ASGARDEX_KEYSTORE'
const BASE_CURRENCY = 'BASE_CURRENCY'

export const saveBaseCurrency = (currency: string) => {
  localStorage.setItem(BASE_CURRENCY, currency)
}

export const getBaseCurrency = (): string => {
  return (
    (localStorage.getItem(BASE_CURRENCY) as string) || Asset.USD().toString()
  )
}

export const saveTheme = (themeType: ThemeType) => {
  localStorage.setItem(THEME_TYPE, themeType)
}

export const getTheme = (): ThemeType => {
  return (localStorage.getItem(THEME_TYPE) as ThemeType) || ThemeType.LIGHT
}

export const saveKeystore = (keystore: Keystore) => {
  localStorage.setItem(ASGARDEX_KEYSTORE, JSON.stringify(keystore))
}

export const getKeystore = (): Keystore | null => {
  const item = localStorage.getItem(ASGARDEX_KEYSTORE)

  if (item) {
    return JSON.parse(item) as Keystore
  }
  return null
}
