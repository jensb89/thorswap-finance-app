import React, { RefObject, useCallback, useMemo, useRef, useState } from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd/lib/menu'

import { useClickOutside } from '../../../hooks/useOutsideClick'
import { Input } from '../Input'
import { Menu, MenuItem } from './FilterMenu.style'

type Props<T> = {
  data: T[]
  placeholder?: string
  searchEnabled?: boolean
  cellRenderer: (data: T) => { key: string; node: JSX.Element }
  disableItemFilter?: (item: T) => boolean
  filterFunction: (item: T, searchTerm: string) => boolean
  onSelect?: (value: string) => void
  closeMenu?: () => void
}

export const FilterMenu = <T extends unknown>(props: Props<T>): JSX.Element => {
  const {
    onSelect = () => {},
    searchEnabled = false,
    data,
    filterFunction,
    cellRenderer,
    disableItemFilter = () => false,
    placeholder = 'Search',
    closeMenu,
  } = props

  const [searchTerm, setSearchTerm] = useState('')

  const handleClick: MenuProps['onClick'] = useCallback(
    (event) => {
      if (!event || !event.key || event.key === '_search') return

      setSearchTerm('')
      onSelect(event.key)
    },
    [onSelect],
  )

  const handleSearchChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = event.currentTarget.value
      setSearchTerm(newSearchTerm)
    },
    [],
  )

  const ref: RefObject<HTMLDivElement> = useRef(null)

  useClickOutside<HTMLDivElement>(ref, () => closeMenu && closeMenu())

  const filteredData: T[] = useMemo(
    () =>
      searchTerm === ''
        ? data
        : data.filter((item) => filterFunction(item, searchTerm)),
    [data, filterFunction, searchTerm],
  )

  return (
    <div ref={ref}>
      <Menu onClick={handleClick}>
        {searchEnabled && (
          <Menu.Item disabled key="_search">
            <Input
              value={searchTerm}
              onChange={handleSearchChanged}
              placeholder={placeholder}
              sizevalue="big"
              typevalue="ghost"
              suffix={<SearchOutlined />}
            />
          </Menu.Item>
        )}
        {filteredData.map((item: T) => {
          const { key, node } = cellRenderer(item)
          const disableItem = disableItemFilter(item)

          return (
            <MenuItem disabled={disableItem} key={key}>
              {node}
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}

export default FilterMenu
