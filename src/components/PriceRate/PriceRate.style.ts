import styled from 'styled-components'

import { Button } from '../UIElements'

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  flex: 1;
`

export const ReverseBtn = styled(Button).attrs({
  fixedWidth: false,
  sizevalue: 'small',
  typevalue: 'outline',
  round: true,
})`
  min-width: 18px;
  height: 18px !important;
  padding: 0;
  margin: 0 7px;
`
