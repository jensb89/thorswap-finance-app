import React from 'react'

import Logo from 'components/Logo'
import ThemeSwitch from 'components/ThemeSwitch'

import * as Styled from './Header.style'

const Header = () => {
  return (
    <Styled.HeaderContainer>
      <Styled.HeaderLogo>
        <Logo type="asgardex" />
      </Styled.HeaderLogo>
      <ThemeSwitch />
    </Styled.HeaderContainer>
  )
}

export default Header
