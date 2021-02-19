import { ContentView, PoolChart } from 'components'
import styled from 'styled-components'
import { palette } from 'styled-theme'

export const Container = styled(ContentView)`
  background: ${palette('background', 3)};
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const PoolInfo = styled.div`
  display: flex;
  align-items: center;
`

export const Section = styled.div`
  margin-bottom: 20px;
`

export const Chart = styled(PoolChart)`
  height: 100%;
`
