import styled from 'styled-components'
import { palette } from 'styled-theme'

import { WalletButton } from '../UIElements'

export const HeaderContainer = styled.div`
  position: fixed;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100vw;
  height: 70px;

  padding: 0 10px;
  background-color: ${palette('background', 0)};
  z-index: 999;
`

export const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  margin: 0 20px;
  padding-top: 12px;
`

export const HeaderAction = styled.div`
  display: flex;
  align-items: center;
`

export const HeaderCenterWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;

  border: 1px solid ${palette('gray', 0)};
  border-radius: 4px;
`

export const WalletBtn = styled(WalletButton)`
  margin-left: 10px;
`

export const TxIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 10px;

  svg {
    width: 20px;
    height: 20px;
  }
`
