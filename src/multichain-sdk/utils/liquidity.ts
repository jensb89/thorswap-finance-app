import { MemberDetails, MemberPool } from 'midgard-sdk'

import { Pool } from '../entities/pool'

export const getMemberDetailByPool = ({
  memberDetails,
  pool,
}: {
  memberDetails: MemberDetails
  pool: Pool
}): MemberPool | undefined => {
  return memberDetails.pools.find(
    (memberPool: MemberPool) => memberPool.pool === pool.asset.toString(),
  )
}
