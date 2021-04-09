import styled from 'styled-components'
import { palette } from 'styled-theme'

export const CoreButton = styled.button<{ round?: boolean; focused?: boolean }>`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 32px;
  margin-left: 8px;
  padding: 0.15rem 0.25rem;
  border-radius: ${(props) => (props.round ? '50%' : '0.5rem')};

  font-weight: ${(props) => (props.focused ? 'bold' : 'normal')};
  border-width: ${(props) => (props.focused ? '1px' : '0px')};
  border-color: ${(props) =>
    props.focused ? palette('primary', 0) : 'transparent'};

  outline: none;

  :hover {
    cursor: pointer;
    outline: none;
    background-color: ${palette('background', 2)};
  }

  > * {
    stroke: ${palette('text', 0)};
  }
`
