import styled from 'styled-components'

import { Label } from '../Label'

const NoWrapLabel = styled(Label)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Title = styled(NoWrapLabel)`
  padding: 11px 0;
  padding-bottom: 4px;
`

export const Value = styled(NoWrapLabel)`
  padding-top: 4px;
  font-size: 13px;
  text-transform: uppercase;
`

export const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  letter-spacing: 1px;
`
