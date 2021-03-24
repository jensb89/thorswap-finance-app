import styled from 'styled-components'
import { palette } from 'styled-theme'

import { transition } from 'settings/style-util'

export const AssetInputWrapper = styled.div<{
  disabled: boolean
  border: boolean
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 50px;
  height: 64px;
  padding: 2px 8px;

  text-transform: uppercase;
  ${transition()};

  border-radius: 2px;
  border: 1px solid
    ${({ disabled, border }) =>
      disabled || !border ? 'transaparent' : palette('gray', 0)};

  &:hover {
    border-color: ${palette('success', 0)};
  }

  .asset-input-header {
    display: flex;
    align-items: center;

    .asset-input-title {
      font-size: 13px;
      color: ${palette('text', 0)};
      letter-spacing: 1px;
      margin-right: 4px;
    }
    .asset-input-info {
      font-size: 13px;
      color: ${palette('text', 2)};
      letter-spacing: 1px;
    }
  }

  .asset-input-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .asset-amount-label {
      white-space: nowrap;
      font-size: 12px;
      color: ${palette('text', 2)};
      letter-spacing: 1px;
      text-align: right;
    }
  }
`
