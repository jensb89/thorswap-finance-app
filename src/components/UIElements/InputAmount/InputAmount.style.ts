import styled from 'styled-components'
import { palette } from 'styled-theme'

import Input from '../Input'

type Props = {
  outlined: boolean
}

export const StyledInput = styled(Input)<Props>`
  width: 100%;
  background: ${palette('background', 1)};
  color: ${palette('text', 0)};
  font-size: 24px;
  ${(props) =>
    !props.outlined &&
    `
      &.ant-input {
        border: none;
        padding: 0;
        &:focus {
          outline: none;
          border: none;
          box-shadow: none;
        }
      }
      &.ant-input.ant-input-disabled {
        background-color: ${palette('background', 1)};
        color: ${palette('text', 0)};
      }
  `}
`
