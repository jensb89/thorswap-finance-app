import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

import { ExternalButtonLink } from '../../Link'
import { CoreButton, Label } from '../../UIElements'

export const Container = styled.div<{ collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;

  border: 1px solid ${palette('gray', 0)};
  background: ${palette('background', 1)};

  height: ${(props) => (props.collapsed ? '42px' : 'auto')};

  overflow: hidden;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 4px 4px 4px 8px;
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;

  button {
  }
`

export const HeaderBtn = styled(CoreButton)<{
  color: 'primary' | 'success' | 'warning' | 'error'
}>`
  margin-left: 0;

  svg {
    stroke: ${(props) => palette(props.color, 0)};
  }
`

export const TxMonitor = styled.div<{ collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;

  height: ${(props) => (props.collapsed ? '50px' : 'auto')};
`

export const ProgressIconWrapper = styled.div<{
  color: 'primary' | 'success' | 'warning' | 'error'
}>`
  padding: 2px;
  margin-right: 6px;

  svg {
    color: ${(props) => palette(props.color, 0)};
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  border-top: 1px solid ${palette('gray', 0)};
  background: ${palette('background', 3)};

  padding: 4px 4px;
`

export const TxInformation = styled.div<{ border?: boolean }>`
  display: flex;
  align-items: center;

  width: 100%;
  padding: 4px;

  border-top: 1px solid ${palette('gray', 0)};
  border-top-width: ${(props) => (props.border ? '1px' : '0px')};
`

export const ExternalLinkWrapper = styled(ExternalButtonLink)<{
  color: 'primary' | 'success' | 'warning' | 'error'
}>`
  margin-left: auto;
  margin-right: 4px;
  svg {
    width: 16px;
    height: 16px;
    stroke: ${(props) => palette(props.color, 0)};
  }
`

export const TxTitle = styled(Label)`
  flex: 1;
`
