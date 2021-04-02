import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

import { media } from 'helpers/style'

import { Panel } from '../Panel'

export const Container = styled(Panel)`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  background: ${palette('background', 0)};
  margin-left: auto;
  margin-right: auto;
  padding-top: 0px;

  border-radius: 14px;
  border: 1px solid ${palette('gray', 0)};
`

export const ContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  padding: 16px 8px 8px 8px;

  ${media.sm`
    padding: 16px 12px 4px 12px;
  `}
`

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  padding: 0 10px;
`

export const HeaderMenu = styled.div`
  display: flex;
  align-items: center;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`

export const PoolDetailLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  color: ${palette('text', 0)};
`

export const MenuIconWrapper = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;

  font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};

  svg {
    color: ${(props) =>
      props.selected ? palette('primary', 0) : palette('text', 0)};
  }
`
