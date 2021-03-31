import styled from 'styled-components'
import { palette } from 'styled-theme'

import { FancyButton } from '../../UIElements'

export const Content = styled.div`
  width: 100%;
  flex-direction: column;

  padding: 20px 20px;
`

export const ModalIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${palette('text', 2)};
`

export const ModalData = styled.div`
  margin-bottom: 10px;
`

export const Button = styled(FancyButton)`
  width: 100% !important;
`
