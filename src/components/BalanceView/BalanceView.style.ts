import styled from 'styled-components/macro'

import { Button } from 'components/UIElements'

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
`

export const ChainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4px 0;
`

export const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 8px 8px;
`

export const SendBtn = styled(Button)``
