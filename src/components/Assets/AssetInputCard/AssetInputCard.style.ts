import styled from 'styled-components'
import { palette } from 'styled-theme'

import { Label, Button } from '../../UIElements'
import { AssetInput as UnstyledAssetInput } from '../AssetInput'
import { AssetSelect as UnstyledAssetSelect } from '../AssetSelect'

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;

  border: 1px solid ${palette('gray', 0)};
  border-radius: 4px;

  padding-right: 4px;
`

export const CardContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 0px;
  width: 100%;
`

export const AssetInputContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  width: 250px;
`

export const AssetInput = styled(UnstyledAssetInput)`
  flex-grow: 1;
  margin-right: 0;
`

export const AssetSelect = styled(UnstyledAssetSelect)``

export const AssetInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  height: 100%;

  padding-bottom: 10px;
`

export const BalanceLabel = styled(Label).attrs({
  size: 'normal',
})`
  font-size: 13px;
  cursor: pointer;
  &:hover {
    font-weight: bold;
  }
`

export const MaxBtn = styled(Button).attrs({
  typevalue: 'outline',
  round: true,
  fixedWidth: false,
})`
  &.ant-btn {
    border-radius: 8px;
    width: 44px;
    margin-bottom: 6px;
  }
`

export const Balance = styled.div`
  margin-left: 6px;
  margin-bottom: 4px;
`
