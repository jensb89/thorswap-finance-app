import { Label, Panel, FancyButton } from 'components'
import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

import { media } from 'helpers/style'

export const Container = styled(Panel)`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  background: ${palette('background', 0)};
  margin-left: auto;
  margin-right: auto;
  padding-top: 0px;

  border-radius: 14px;
  border: 1px solid ${palette('gray', 0)};
`

export const ContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  padding: 16px 8px 8px 8px;

  ${media.sm`
    padding: 16px 12px 4px 12px;
  `}
`

export const ToolContainer = styled.div`
  display: flex;

  height: 60px;
`

export const SliderWrapper = styled.div`
  width: 260px;
`

export const SwitchPair = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  svg {
    width: 24px;
    height: 24px;
    color: ${palette('primary', 0)};
    transform: rotate(90deg);
  }
`

export const PoolSelect = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 24px 0;
`

export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 0;
`

export const FormLabel = styled(Label).attrs({
  weight: 'bold',
})`
  margin-bottom: 8px;
`

export const ConfirmButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 2%;

  margin-top: 14px;

  button {
    flex: 1;
  }
`

export const ConfirmModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`

export const SwapInfo = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 8px;
  margin-top: 14px;

  border: 1px solid ${palette('gray', 0)};
`

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  padding: 0 10px;
`

export const HeaderMenu = styled.div`
  display: flex;
  align-items: center;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`

export const ApproveBtn = styled(FancyButton)`
  margin-right: 8px;
`

export const PoolDetailLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  color: ${palette('text', 0)};
`
