import React, { useCallback, useState } from 'react'

import { delay } from '@xchainjs/xchain-util'
import { Dropdown } from 'antd'
import { Asset } from 'multichain-sdk'

import { AssetMenu } from '../AssetMenu'
import {
  AssetSelectWrapper,
  AssetDropdownButton,
  AssetSelectMenuWrapper,
  DropdownIconHolder,
  DropdownIcon,
  AssetData,
  Selector,
} from './AssetSelect.style'

type DropdownCarretProps = {
  open: boolean
  onClick?: () => void
}

const DropdownCarret: React.FC<DropdownCarretProps> = (
  props: DropdownCarretProps,
): JSX.Element => {
  const { open, onClick = () => {} } = props
  return (
    <DropdownIconHolder>
      <DropdownIcon open={open} onClick={onClick} />
    </DropdownIconHolder>
  )
}

export type Props = {
  assets: Asset[]
  asset: Asset
  withSearch?: boolean
  showLabel?: boolean
  searchDisable?: string[]
  onSelect: (_: Asset) => void
  minWidth?: number
  searchPlaceholder?: string
  size?: 'small' | 'normal' | 'big'
  disabled?: boolean
}

export const AssetSelect: React.FC<Props> = (props): JSX.Element => {
  const {
    asset,
    assets = [],
    withSearch = true,
    showLabel = true,
    searchDisable = [],
    onSelect = () => {},
    children,
    minWidth,
    searchPlaceholder = 'Search...',
    size = 'small',
    disabled = false,
    ...others
  } = props

  const [openDropdown, setOpenDropdown] = useState<boolean>(false)

  const closeMenu = useCallback(() => {
    if (openDropdown) {
      setOpenDropdown(false)
    }
  }, [setOpenDropdown, openDropdown])

  const handleDropdownButtonClicked = (e: React.MouseEvent) => {
    e.stopPropagation()
    // toggle dropdown state
    setOpenDropdown(!openDropdown)
  }

  const handleChangeAsset = useCallback(
    async (assetId: string) => {
      setOpenDropdown(false)

      // Wait for the dropdown to close
      await delay(100)
      const changedAsset = assets.find((a: Asset) => assetId === a.toString())
      if (changedAsset) {
        onSelect(changedAsset)
      }
    },
    [assets, onSelect],
  )

  const renderMenu = useCallback(() => {
    const sortedAssetData = assets.sort((a: Asset, b: Asset) =>
      a.sortsBefore(b),
    )
    return (
      <AssetSelectMenuWrapper minWidth={minWidth}>
        <AssetMenu
          searchPlaceholder={searchPlaceholder}
          closeMenu={closeMenu}
          assets={sortedAssetData}
          asset={asset}
          withSearch={withSearch}
          searchDisable={searchDisable}
          onSelect={handleChangeAsset}
        />
      </AssetSelectMenuWrapper>
    )
  }, [
    assets,
    asset,
    closeMenu,
    handleChangeAsset,
    searchDisable,
    withSearch,
    minWidth,
    searchPlaceholder,
  ])

  const renderDropDownButton = () => {
    const invalid = assets.length === 0
    return (
      <AssetDropdownButton disabled={invalid || disabled}>
        {!invalid ? <DropdownCarret open={openDropdown} /> : null}
      </AssetDropdownButton>
    )
  }

  return (
    <AssetSelectWrapper minWidth={minWidth} {...others}>
      <Dropdown overlay={renderMenu()} trigger={[]} visible={openDropdown}>
        <>
          {!!children && children}
          <Selector onClick={handleDropdownButtonClicked}>
            <AssetData asset={asset} showLabel={showLabel} size={size} />
            {renderDropDownButton()}
          </Selector>
        </>
      </Dropdown>
    </AssetSelectWrapper>
  )
}
