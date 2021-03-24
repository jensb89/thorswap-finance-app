import styled from 'styled-components'
import { palette } from 'styled-theme'

export const ContentViewWrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding: 4px 0;
  background: ${palette('background', 1)};
`
