import React, { useRef, useCallback } from 'react'

import { Amount } from 'multichain-sdk'

import {
  InputAmount,
  InputAmountProps,
} from 'components/UIElements/InputAmount'

import { AssetInputWrapper } from './AssetInput.style'

export type Props = {
  title: string
  info?: string
  amount: Amount
  label?: string
  inputProps?: InputAmountProps
  decimal?: number
  disabled?: boolean
  border?: boolean
  onChange: (value: Amount) => void
}

export const AssetInput: React.FC<Props> = (props): JSX.Element => {
  const {
    title,
    amount,
    info,
    label,
    inputProps = {},
    onChange,
    decimal = 8,
    border = true,
    ...otherProps
  } = props

  const inputRef = useRef<HTMLDivElement>(null)
  const { disabled = false } = inputProps

  const onChangeHandler = useCallback(
    (value: Amount) => {
      onChange(value)
    },
    [onChange],
  )

  const handleClickWrapper = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    inputRef.current?.firstChild?.focus()
  }, [])

  return (
    <AssetInputWrapper
      disabled={disabled}
      onClick={handleClickWrapper}
      border={border}
      {...otherProps}
    >
      <div className="asset-input-header">
        <span className="asset-input-title">{title}</span>
        {info && <span className="asset-input-info">{info}</span>}
      </div>
      <div className="asset-input-content" ref={inputRef}>
        <InputAmount
          value={amount}
          onChange={onChangeHandler}
          sizevalue="big"
          decimal={decimal}
          outlined={false}
          {...inputProps}
        />
        {label && <span className="asset-amount-label">{label}</span>}
      </div>
    </AssetInputWrapper>
  )
}
