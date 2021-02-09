import styled from 'styled-components'
import { palette } from 'styled-theme'

export const LogoWrapper = styled.div`
  display: block;
  cursor: pointer;

  #Thorchain_logo-copy {
    > :not(:first-child) {
      fill: ${palette('text', 1)};
    }
  }

  #asgardex_logo {
    path {
      fill: ${palette('text', 1)};
    }
  }
`
