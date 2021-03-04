import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { Asset, Pool } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'

import * as Styled from './PoolShare.style'

export const PoolShare = ({
  asset,
  pool,
  address,
}: {
  asset: Asset
  pool: Pool
  address: string
}) => {
  const dispatch = useDispatch()
  const { actions } = useMidgard()

  console.log(asset)
  console.log(pool)

  useEffect(() => {
    dispatch(actions.getMemberDetail(address))
  }, [dispatch, actions, address])

  return (
    <Styled.Container>
      <Styled.Section>
        <Styled.HeaderLabel>YOUR POOL SHARE</Styled.HeaderLabel>
        <Styled.SectionData>
          <Styled.ShareSection>
            <Styled.ShareData>
              <Styled.DataTitle>LIQUIDITY UNITS</Styled.DataTitle>
              <Styled.DataValue>123</Styled.DataValue>
            </Styled.ShareData>
            <Styled.ShareData>
              <Styled.DataTitle>POOL SHARE</Styled.DataTitle>
              <Styled.DataValue>123%</Styled.DataValue>
            </Styled.ShareData>
          </Styled.ShareSection>
        </Styled.SectionData>
      </Styled.Section>
      <Styled.Section>
        <Styled.HeaderLabel>CURRENT REDEMPTION VALUE</Styled.HeaderLabel>
        <Styled.SectionData>
          <Styled.RedemptionSection>
            <Styled.ShareSection>
              <Styled.ShareData>
                <Styled.DataTitle>RUNE</Styled.DataTitle>
                <Styled.DataValue>123</Styled.DataValue>
                <Styled.DataInfo>$123</Styled.DataInfo>
              </Styled.ShareData>
              <Styled.ShareData>
                <Styled.DataTitle>ASSET</Styled.DataTitle>
                <Styled.DataValue>123%</Styled.DataValue>
                <Styled.DataInfo>$123</Styled.DataInfo>
              </Styled.ShareData>
            </Styled.ShareSection>
          </Styled.RedemptionSection>
          <Styled.ShareData>
            <Styled.DataTitle>TOTAL VALUE</Styled.DataTitle>
            <Styled.DataValue>$123</Styled.DataValue>
          </Styled.ShareData>
        </Styled.SectionData>
      </Styled.Section>
    </Styled.Container>
  )
}
