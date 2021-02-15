import React, { useMemo, useCallback } from 'react'

import { LoadingOutlined } from '@ant-design/icons'
import * as RD from '@devexperts/remote-data-ts'
import { Asset } from 'multichain-sdk'

import { useRemoteImage } from 'hooks/useRemoteImage'

import { getIntFromName, rainbowStop } from 'helpers/color'

import * as Styled from './AssetIcon.style'
import { Size } from './types'
import { getAssetIconUrl } from './utils'

type ComponentProps = {
  size?: Size
  asset: Asset
}

export type Props = ComponentProps & React.HTMLAttributes<HTMLDivElement>

export const AssetIcon: React.FC<Props> = ({
  asset,
  size = 'normal',
  ...rest
}): JSX.Element => {
  const imgUrl = useMemo(() => {
    return getAssetIconUrl(asset)
  }, [asset])

  const remoteIconImage = useRemoteImage(imgUrl)

  const renderIcon = useCallback(
    (src: string) => (
      <Styled.IconWrapper size={size} {...rest}>
        <Styled.Icon src={src} size={size} />{' '}
      </Styled.IconWrapper>
    ),
    [size, rest],
  )

  const renderPendingIcon = useCallback(() => {
    return (
      <Styled.IconWrapper size={size}>
        <LoadingOutlined />
      </Styled.IconWrapper>
    )
  }, [size])

  const renderFallbackIcon = useCallback(() => {
    const { ticker } = asset
    const numbers = getIntFromName(ticker)
    const backgroundImage = `linear-gradient(45deg,${rainbowStop(
      numbers[0],
    )},${rainbowStop(numbers[1])})`

    return (
      <Styled.IconWrapper {...rest} size={size}>
        <Styled.IconFallback style={{ backgroundImage }} size={size}>
          {ticker}
        </Styled.IconFallback>
      </Styled.IconWrapper>
    )
  }, [asset, size, rest])

  return RD.fold(
    () => <></>,
    renderPendingIcon,
    renderFallbackIcon,
    renderIcon,
  )(remoteIconImage)
}
