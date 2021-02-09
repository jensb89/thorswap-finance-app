import styled from 'styled-components'
import { palette } from 'styled-theme'

import Label from '../Label'

export const AddWalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .add-wallet-icon {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100px;
    height: 100px;
    margin-bottom: 20px;
    border-radius: 50%;
    background: ${palette('background', 1)};
    svg {
      width: 60px;
      height: 60px;
      fill: ${palette('gray', 1)};
    }
  }
`

export const ConnectLabel = styled(Label)`
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 10px;
`
