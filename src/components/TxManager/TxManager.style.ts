import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

export const Container = styled.div<{ collapsed: boolean }>`
  background: transparent;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  right: 20px;
  top: 14px;

  width: 32px;
  height: 32px;

  border: 1px solid ${palette('primary', 0)};
  border-radius: 50%;

  button {
    margin: 0;
    padding-top: 2px;
    padding-left: 3px;
    border-radius: 50%;

    width: 100%;
    height: 100%;

    svg {
      color: ${palette('primary', 0)};
    }
  }

  z-index: 200;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;
  right: 20px;
  top: 54px;
`

export const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;
  right: 20px;
  top: 54px;

  padding: 4px 8px;

  border: 1px solid ${palette('gray', 0)};
  border-radius: 4px;
`
