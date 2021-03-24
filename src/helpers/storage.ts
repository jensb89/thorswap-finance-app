import { ThemeType } from '@thorchain/asgardex-theme'
import { Keystore } from '@xchainjs/xchain-crypto'
import { Asset } from 'multichain-sdk'

const THEME_TYPE = 'THEME_TYPE'
const THORSWAP_MULTICHAIN_KEYSTORE = 'THORSWAP_MULTICHAIN_KEYSTORE'
const THORSWAP_MULTICHAIN_ADDR = 'THORSWAP_MULTICHAIN_ADDR'

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
  return (localStorage.getItem(THEME_TYPE) as ThemeType) || ThemeType.DARK
}

export const saveKeystore = (keystore: Keystore) => {
  sessionStorage.setItem(THORSWAP_MULTICHAIN_KEYSTORE, JSON.stringify(keystore))
}

export const getKeystore = (): Keystore | null => {
  const item = sessionStorage.getItem(THORSWAP_MULTICHAIN_KEYSTORE)

  if (item) {
    return JSON.parse(item) as Keystore
  }

  return null
}

export const saveAddress = (address: string) => {
  sessionStorage.setItem(THORSWAP_MULTICHAIN_ADDR, address)
}

export const getAddress = (): string | null => {
  const item = sessionStorage.getItem(THORSWAP_MULTICHAIN_ADDR)

  if (item) {
    return item
  }
  return null
}
