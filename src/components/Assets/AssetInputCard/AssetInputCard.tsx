import React from 'react'

import { Amount, Asset, Price } from 'multichain-sdk'

import { InputAmountProps } from 'components/UIElements/InputAmount'

import {
  CardWrapper,
  CardContent,
  AssetInput,
  AssetSelect,
  AssetInputContent,
  AssetInfo,
  BalanceLabel,
  MaxBtn,
  Balance,
} from './AssetInputCard.style'

export type Props = {
  // AssetInput Props
  title: string
  amount?: Amount
  label?: string
  inputProps?: InputAmountProps
  decimal?: number
  onChange?: (value: Amount) => void
  balance?: Amount
  usdPrice?: Price
  onMax?: () => void
  // AssetSelect Props
  asset: Asset
  assets: Asset[]
  withSearch?: boolean
  searchDisable?: string[]
  onSelect: (_: Asset) => void
  minWidth?: number
  searchPlaceholder?: string
}

export const AssetInputCard: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    // AssetInput Props
    title,
    amount = Amount.fromAssetAmount(0, 8),
    label = '',
    inputProps = { disabled: false },
    decimal = 8,
    onChange = () => {},
    balance,
    usdPrice,
    onMax,
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
        <AssetInputContent>
          <AssetInput
            title={title}
            amount={amount}
            label={label}
            info={usdPrice && `(${usdPrice.toCurrencyFormat(2)})`}
            inputProps={inputProps}
            decimal={decimal}
            onChange={onChange}
            border={false}
          />
          {onMax && <MaxBtn onClick={onMax}>Max</MaxBtn>}
        </AssetInputContent>
        <AssetInfo>
          {balance && (
            <Balance onClick={() => onMax?.()}>
              <BalanceLabel>BALANCE: {balance.toFixed(2)}</BalanceLabel>
            </Balance>
          )}
          <AssetSelect
            asset={asset}
            assets={assets}
            withSearch={withSearch}
            searchDisable={searchDisable}
            minWidth={minWidth}
            searchPlaceholder={searchPlaceholder}
            onSelect={onSelect}
          />
        </AssetInfo>
      </CardContent>
    </CardWrapper>
  )
}
