import React, { useMemo, useCallback } from 'react'

import { Asset } from 'multichain-sdk'

import { FilterMenu } from 'components/UIElements/FilterMenu'

import { AssetData } from '../AssetData'

const filterFunction = (asset: Asset, searchTerm: string) => {
  const { ticker } = asset
  return ticker?.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0
}

export type Props = {
  asset: Asset
  assets: Asset[]
  searchDisable: string[]
  withSearch?: boolean
  searchPlaceholder?: string
  onSelect: (value: string) => void
  closeMenu?: () => void
}

export const AssetMenu: React.FC<Props> = (props): JSX.Element => {
  const {
    searchPlaceholder,
    assets,
    asset,
    withSearch = true,
    searchDisable = [],
    onSelect = () => {},
    closeMenu,
  } = props

  const filteredData = useMemo(
    (): Asset[] => assets.filter((a: Asset) => !asset.eq(a)),
    [asset, assets],
  )

  const cellRenderer = useCallback((a: Asset) => {
    const node = <AssetData asset={a} />
    const key = a.toString()
    return { key, node }
  }, [])

  const disableItemFilterHandler = useCallback(
    (a: Asset) => searchDisable.indexOf(a.ticker) > -1,
    [searchDisable],
  )

  return (
    <FilterMenu
      placeholder={searchPlaceholder}
      closeMenu={closeMenu}
      searchEnabled={withSearch}
      filterFunction={filterFunction}
      cellRenderer={cellRenderer}
      disableItemFilter={(a: Asset) => disableItemFilterHandler(a)}
      onSelect={onSelect}
      data={filteredData}
    />
  )
}
