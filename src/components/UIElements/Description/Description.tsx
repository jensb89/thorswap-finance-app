import React from 'react'

import { StatusWrapper, Title, Value } from './Description.style'

export type Props = {
  title?: string
  value?: string
  loading?: boolean
}

const Status: React.FC<Props> = (props: Props): JSX.Element => {
  const { title = '', value = '', loading = false, ...otherProps } = props

  return (
    <StatusWrapper {...otherProps}>
      {loading && '...'}
      {!loading && (
        <>
          {title && (
            <Title size="normal" color="gray">
              {title}
            </Title>
          )}
          <Value size="normal">{value}</Value>
        </>
      )}
    </StatusWrapper>
  )
}

export default Status
