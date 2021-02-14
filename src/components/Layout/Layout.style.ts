import { Layout as AntLayout } from 'antd'
import { media } from 'helpers/style'
import styled from 'styled-components'
import { palette } from 'styled-theme'

const { Content } = AntLayout

export const LayoutWrapper = styled(AntLayout)``

export const ContentWrapper = styled(Content)`
  display: flex;
  flex-direction: column;

  background: ${palette('background', 3)};
  min-height: calc(100vh - 120px);
  margin-top: 90px;
  padding: 10px;

  ${media.sm`
    padding: 20px;
  `}
  ${media.md`
    padding: 30px;
  `}
`
