import { ContentView } from 'components'
import styled from 'styled-components'
import { palette } from 'styled-theme'

export const HomeContainer = styled(ContentView)`
  background: ${palette('background', 3)};
`
export const PoolTableView = styled.div`
  margin-top: 18px;
`

export const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
