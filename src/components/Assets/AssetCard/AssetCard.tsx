import React, {
  useRef,
  useState,
  RefObject,
  useCallback,
  useMemo,
  useEffect,
} from 'react'

import { Slider } from 'components/UIElements/Slider'
import { Amount, Asset, Percent } from 'multichain-sdk'

import * as Styled from './AssetCard.style'

export type Props = {
  asset: Asset
  assets?: Asset[]
  onChangeAsset?: (asset: Asset) => void
  amount: Amount
  onChangeAmount?: (value: Amount) => void
  maxAmount: Amount
  slip?: Percent
  title?: string
  searchDisable?: string[]
  withSearch?: boolean
  sliderPercent?: number
  onChangePercent?: (percent: number) => void
  footerLabel?: string
  disabled?: boolean
}

export const AssetCard: React.FC<Props> = (props): JSX.Element => {
  const {
    asset,
    assets = [],
    slip,
    sliderPercent = NaN,
    withSearch = true,
    searchDisable = [],
    amount,
    maxAmount,
    onChangeAmount = () => {},
    onChangeAsset = () => {},
    onChangePercent = () => {},
    footerLabel,
    disabled,
    ...others
  } = props

  const [wrapperWidth, setWrapperWidth] = useState(0)
  const ref: RefObject<HTMLDivElement> = useRef(null)

  const handleChangeAsset = useCallback(
    async (changedAsset: Asset) => {
      if (changedAsset) {
        onChangeAsset(changedAsset)
        onChangeAmount(Amount.fromAssetAmount(0, amount.decimal))
      }
    },
    [onChangeAsset, onChangeAmount, amount],
  )

  const withPercentSlider = useMemo(() => !isNaN(sliderPercent), [
    sliderPercent,
  ])

  // Needed to have appropriate width of a dropdown
  useEffect(() => {
    // it will be executed only once after componentDidMount
    setWrapperWidth(!ref.current ? 0 : ref.current.clientWidth)
    const listener = () => {
      setWrapperWidth(!ref.current ? 0 : ref.current.clientWidth)
    }
    window.addEventListener('resize', listener)

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [setWrapperWidth])

  return (
    <Styled.AssetCardWrapper ref={ref} {...others}>
      <Styled.CardBorderWrapper>
        <Styled.AssetNameLabel>
          {asset.ticker ?? 'unknown'}
        </Styled.AssetNameLabel>
        <Styled.CardTopRow>
          <Styled.AssetSelect
            minWidth={wrapperWidth}
            assets={assets}
            asset={asset}
            onSelect={handleChangeAsset}
            withSearch={withSearch}
            searchDisable={searchDisable}
            showLabel={false}
          >
            <Styled.AssetData>
              <Styled.InputAmount
                disabled={disabled}
                value={amount}
                onChange={onChangeAmount}
                decimal={8}
              />
              <Styled.AssetCardFooter>
                <Styled.FooterLabel>{footerLabel}</Styled.FooterLabel>
                {slip !== undefined && (
                  <Styled.FooterLabel>
                    SLIP: {slip.toFixed()} %
                  </Styled.FooterLabel>
                )}
              </Styled.AssetCardFooter>
            </Styled.AssetData>
          </Styled.AssetSelect>
        </Styled.CardTopRow>
      </Styled.CardBorderWrapper>
      {withPercentSlider && (
        <Styled.SliderWrapper>
          <Slider
            disabled={disabled}
            value={sliderPercent}
            onChange={onChangePercent}
            tooltipPlacement="top"
            withLabel
          />
        </Styled.SliderWrapper>
      )}
    </Styled.AssetCardWrapper>
  )
}
