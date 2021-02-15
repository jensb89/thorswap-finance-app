import { Row } from 'antd'
import styled from 'styled-components'

import { Label } from 'components/UIElements/Label'

import { AssetIcon as UIAssetIcon } from '../AssetIcon'

export type AssetDataSize = 'small' | 'normal' | 'big'

export const Wrapper = styled(Row).attrs({
  align: 'middle',
})`
  display: flex;
  padding: 0 16px;
`

export const AssetIcon = styled(UIAssetIcon)``

export const TickerLabel = styled(Label).attrs({
  textTransform: 'uppercase',
  weight: '600',
})`
  padding-left: 10px;
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
