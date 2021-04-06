import { Label, Panel } from 'components'
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

export const PoolSelect = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 8px 16px;
`

export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
`

export const FormLabel = styled(Label).attrs({
  weight: 'bold',
})`
  margin-bottom: 8px;
`

export const ConfirmModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`

export const MemoTypes = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 130px;
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
