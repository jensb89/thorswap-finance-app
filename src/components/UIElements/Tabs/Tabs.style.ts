import { Tabs } from 'antd'
import styled from 'styled-components'
import { size, key, palette } from 'styled-theme'

type Props = {
  action: boolean
  withBorder: boolean
}

export const StyledTab = styled(Tabs)`
  width: 100%;

  .ant-tabs-nav-wrap {
    justify-content: center;
  }

  .ant-tabs {
    .ant-tabs-nav-container,
    .ant-tabs-nav-wrap,
    .ant-tabs-nav-scroll,
    .ant-tabs-nav {
      overflow: visible !important;
    }
  }

  .ant-tabs-nav {
    height: ${size('panelHeaderHeight', '50px')};
    padding: 0 ${key('sizes.gutter.content', '25px')};
    font-size: 12px;
    text-transform: uppercase;

    &::before {
      border-bottom-width: ${(props: Props) =>
        props.withBorder ? '1px' : '0px'} !important;
      border-color: ${palette('gray', 0)};
    }

    .ant-tabs-tab,
    .ant-tabs-tab a {
      padding-top: 18px;
      letter-spacing: 2.5px;
      color: ${palette('text', 0)};
      font-weight: bold;

      &:hover {
        color: ${palette('primary', 0)};
      }
    }

    .ant-tabs-tab-active,
    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${palette('primary', 0)};
    }

    .ant-tabs-ink-bar {
      bottom: 0px;
      height: 3px;
      background: ${palette('gradient', 0)};
    }
  }

  .ant-tabs-content {
    width: 100%;
    height: ${(props: Props) => (props.action ? '0' : 'auto')};
    padding: ${key('sizes.gutter.vertical', '20px')} 0;
    ${(props: Props) => props.action && 'padding: 0 0;'}
  }

  .ant-tabs-nav .ant-tabs-tab-disabled,
  .ant-tabs-nav .ant-tabs-tab-disabled:hover {
    color: ${palette('text', 2)};
    cursor: not-allowed;
  }
`
