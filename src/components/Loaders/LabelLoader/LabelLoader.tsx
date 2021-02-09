import React from 'react'

import ContentLoader from 'react-content-loader'

import themes from '@thorchain/asgardex-theme'

const LabelLoader = () => {
  const theme = themes.dark

  return (
    <ContentLoader
      className="content-loader"
      backgroundColor={theme.palette.background[2]}
      foregroundColor={theme.palette.gray[1]}
      height={20}
      width={60}
      speed={1.2}
    >
      <rect x="0" y="0" rx="2" ry="2" width="60" height="20" />
    </ContentLoader>
  )
}

export default LabelLoader
