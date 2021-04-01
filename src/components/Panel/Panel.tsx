import styled from 'styled-components/macro'

import { ContentView } from 'components/ContentView'

import { media } from 'helpers/style'

export const Panel = styled(ContentView)`
  width: calc(100vw - 20px);

  ${media.sm`
    width: 420px;
  `};
`
