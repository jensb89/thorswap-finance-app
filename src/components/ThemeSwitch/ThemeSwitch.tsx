import React from 'react'

import { Moon, Sun } from 'react-feather'

import { ThemeType } from '@thorchain/asgardex-theme'
import { useApp } from 'redux/app/hooks'

import * as Styled from './ThemeSwitch.style'

const ThemeSwitch = () => {
  const { themeType, setTheme } = useApp()

  const toggleTheme = React.useCallback(() => {
    if (themeType === ThemeType.DARK) {
      setTheme(ThemeType.LIGHT)
    } else {
      setTheme(ThemeType.DARK)
    }
  }, [setTheme, themeType])

  return (
    <Styled.IconButton onClick={toggleTheme}>
      {themeType === ThemeType.DARK ? <Moon /> : <Sun />}
    </Styled.IconButton>
  )
}

export default ThemeSwitch
