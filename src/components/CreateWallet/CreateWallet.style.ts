import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

export const TabHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
`

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid ${palette('gray', 0)};
  padding: 14px 14px;
`
