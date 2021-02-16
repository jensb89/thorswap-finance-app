import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

import { Label } from 'components/UIElements'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;

  height: 50px;
  padding: 4px 8px;

  background: ${palette('background', 3)};

  svg {
    font-size: 14px;
    color: ${palette('text', 0)};

    cursor: pointer;
  }
`

export const ChainInfo = styled.div`
  display: flex;
  flex-direction: column;
`

export const InfoLabel = styled(Label)``

export const Address = styled.div`
  display: flex;
  align-items: center;
`

export const AddressLabel = styled(Label)`
  margin-right: 4px;
  cursor: pointer;

  &:hover {
    background: ${palette('gray', 1)};
  }
`

export const Reload = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;

  cursor: ponter;
`
