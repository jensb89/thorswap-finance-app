import { media } from 'helpers/style'
import styled from 'styled-components'

import { AssetInput as UnstyledAssetInput } from '../AssetInput'
import { AssetSelect as UnstyledAssetSelect } from '../AssetSelect'

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 6px;
  ${media.sm`
    flex-direction: row;
    align-items: center;
    min-width: 450px;
  `}
`

export const AssetInput = styled(UnstyledAssetInput)`
  flex-grow: 1;
  margin-right: 0;
  margin-bottom: 10px;

  ${media.sm`
    flex-grow: 1;
    margin-bottom: 0;
    margin-right: 20px;
  `}
`

export const AssetSelect = styled(UnstyledAssetSelect)`
  width: auto;
  ${media.sm`
    width: 170px;
  `}
`
