import React from 'react'

import { Helmet as ReactHelmet } from 'react-helmet'

export const Helmet = ({
  title,
  content,
}: {
  title: string
  content: string
}) => (
  <ReactHelmet>
    <title>{title}</title>
    <meta name="description" content={content} />
  </ReactHelmet>
)
