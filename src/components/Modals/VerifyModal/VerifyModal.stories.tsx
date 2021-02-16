import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { VerifyModal, Props } from './VerifyModal'

export default {
  title: 'Components/VerifyModal',
  component: VerifyModal,
} as Meta

const Template: Story<Props> = (args) => <VerifyModal {...args} />

export const Default = Template.bind({})
Default.args = {
  description: 'sample modal description',
}
