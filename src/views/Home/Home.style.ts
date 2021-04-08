import { ContentView, Table as UnstyledTable } from 'components'
import styled from 'styled-components'
import { palette } from 'styled-theme'

export const HomeContainer = styled(ContentView)`
  background: ${palette('background', 3)};
  margin-top: -20px;
`
export const PoolTableView = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`

export const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Section = styled.div`
  margin-bottom: 20px;
`

export const Table = styled(UnstyledTable)`
  .ant-table-row {
    cursor: pointer;
  }
`
