import React from 'react'

import { Collapse, Helmet } from 'components'

import { faqs } from './data'

const FaqsView: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet title="FAQs" content="FAQs" />
      <Collapse data={faqs} />
    </>
  )
}

export default FaqsView
