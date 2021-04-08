import { Layout as AntLayout } from 'antd'
import { transparentize } from 'polished'
import styled from 'styled-components'
import { palette } from 'styled-theme'

import { media } from 'helpers/style'

const { Content } = AntLayout

export const LayoutWrapper = styled.div``

export const ContentWrapper = styled(Content)<{ transparent: boolean }>`
  display: flex;
  flex-direction: column;

  background: ${(props) =>
    props.transparent ? palette('background', 3) : palette('background', 3)};

  min-height: calc(100vh - 230px);
  padding: 10px 10px 0px 10px;
  ${media.sm`
    padding: 10px 20px 0px 20px;
  `}
  ${media.md`
    padding: 10px 30px 0px 30px;
    min-height: calc(100vh - 146px);
  `}
`

export const NotifyWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
`

export const Notify = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;

  color: ${palette('warning', 0)};
  border: 1px solid ${palette('warning', 0)};
  border-radius: 6px;

  cursor: pointer;

  &:hover {
    background: ${transparentize(0.9, '#fff')};
  }
`
