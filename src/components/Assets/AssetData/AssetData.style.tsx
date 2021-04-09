import { Row } from 'antd'
import styled from 'styled-components'

import { Label } from 'components/UIElements/Label'

import { AssetIcon as UIAssetIcon } from '../AssetIcon'

export type AssetDataSize = 'small' | 'normal' | 'big'

export const Wrapper = styled(Row).attrs({
  align: 'middle',
})`
  display: flex;
  padding: 0 8px;
`

export const AssetIcon = styled(UIAssetIcon)``

export const TickerRow = styled.div`
  display: flex;
  flex-direction: column;
`

export const TickerLabel = styled(Label).attrs({
  textTransform: 'uppercase',
  weight: '600',
})`
  min-width: 50px;
  padding-left: 10px;
  line-height: normal;
`

export const TypeLabel = styled(Label).attrs({
  textTransform: 'uppercase',
  size: 'small',
  color: 'gray',
})`
  min-width: 50px;
  padding-left: 10px;
  line-height: normal;
`

export const AmountLabel = styled(Label).attrs({
  textTransform: 'uppercase',
  weight: '600',
})`
  padding-left: 10px;
`

export const PriceLabel = styled(Label).attrs({
  textTransform: 'uppercase',
  weight: 'normal',
  color: 'light',
})`
  padding-left: 10px;
`
