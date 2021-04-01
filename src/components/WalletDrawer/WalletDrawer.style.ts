import { Drawer as AntDrawer } from 'antd'
import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

import { CoreButton } from '../UIElements'

export const Drawer = styled(AntDrawer)`
  .ant-drawer-body {
    height: 100%;
    padding: 24px 12px;
    background-color: ${palette('background', 1)};
  }
`

export const ActionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    margin-right: 4px;
  }
`

export const Refresh = styled(CoreButton)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;

  width: 100px;

  svg {
    font-size: 18px;
    color: ${palette('primary', 0)};
  }
`
