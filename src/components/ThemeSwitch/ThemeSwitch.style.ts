import styled from 'styled-components'
import { palette } from 'styled-theme'

export const IconButton = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 32px;
  background-color: ${palette('background', 2)};
  margin-left: 8px;
  padding: 0.15rem 0.25rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${palette('background', 2)};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${palette('text', 0)};
  }
`
