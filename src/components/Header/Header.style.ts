import { transparentize } from 'polished'
import styled from 'styled-components'
import { palette } from 'styled-theme'

import { WalletButton } from '../UIElements'

export const HeaderContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100vw;
  height: 70px;

  background-color: transparent;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `linear-gradient(180deg, ${transparentize(
      0.8,
      '#23DCC8',
    )} 0%, ${transparentize(1, theme.palette.background[0])} 100%)`};

  padding: 0 60px 10px 10px;
  z-index: 999;
`

export const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  margin: 0 20px;
  padding-top: 12px;
`

export const HeaderActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

  svg {
    width: 20px;
    height: 20px;
  }
`

export const ToolWrapper = styled.div`
  margin-right: 8px;
`

export const LogoWrapper = styled.div`
  margin-top: 8px;
`
