import styled from 'styled-components'
import { palette } from 'styled-theme'

export const HeaderContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100vw;
  height: 70px;

  padding: 0 10px;
  background-color: ${palette('background', 0)};
`

export const HeaderLogo = styled.div`
  margin: 0 20px;
`
