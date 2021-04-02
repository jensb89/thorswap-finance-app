import { FancyButton } from 'components'
import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

export const ToolContainer = styled.div`
  display: flex;

  height: 60px;
`

export const SliderWrapper = styled.div`
  flex: 1;
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

export const DetailContent = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 8px;
  margin-top: 14px;

  border: 1px solid ${palette('gray', 0)};
`

export const ApproveBtn = styled(FancyButton)`
  margin-right: 8px;
`
