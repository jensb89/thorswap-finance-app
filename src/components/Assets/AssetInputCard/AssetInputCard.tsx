import React from 'react'

import { Props as InputProps } from 'components/UIElements/InputAmount'
import { Amount, Asset } from 'multichain-sdk'

import {
  CardWrapper,
  CardContent,
  AssetInput,
  AssetSelect,
} from './AssetInputCard.style'

export type Props = {
  // AssetInput Props
  title: string
  info?: string
  amount: Amount
  label: string
  inputProps?: InputProps
  decimal?: number
  onChange: (value: Amount) => void
  // AssetSelect Props
  asset: Asset
  assets: Asset[]
  withSearch?: boolean
  searchDisable?: string[]
  onSelect: (_: Asset) => void
  minWidth?: number
  searchPlaceholder?: string
}

const AssetCard: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    // AssetInput Props
    title,
    amount,
    info,
    label,
    inputProps = {},
    decimal = 8,
    onChange,
    // AssetSelect Props
    asset,
    assets = [],
    withSearch = true,
    searchDisable = [],
    minWidth,
    searchPlaceholder = 'Search...',
    onSelect = () => {},
    ...otherProps
  } = props

  return (
    <CardWrapper {...otherProps}>
      <CardContent>
        <AssetInput
          title={title}
          amount={amount}
          label={label}
          info={info}
          inputProps={inputProps}
          decimal={decimal}
          onChange={onChange}
        />
        <AssetSelect
          asset={asset}
          assets={assets}
          withSearch={withSearch}
          searchDisable={searchDisable}
          minWidth={minWidth}
          searchPlaceholder={searchPlaceholder}
          onSelect={onSelect}
        />
      </CardContent>
    </CardWrapper>
  )
}

export default AssetCard
