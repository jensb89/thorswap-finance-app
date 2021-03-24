import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

import { Panel } from '../Panel'

export const ConnectContainer = styled(Panel)`
  border: 1px solid ${palette('gray', 0)};
  border-radius: 14px;
  margin-left: auto;
  margin-right: auto;

  padding-bottom: 24px;
`

export const ConnectTabHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 0;
`

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
`
