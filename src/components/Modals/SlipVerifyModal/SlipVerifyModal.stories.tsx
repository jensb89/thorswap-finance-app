import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { SlipVerifyModal, Props } from './SlipVerifyModal'

export default {
  title: 'Components/SlipVerifyModal',
  component: SlipVerifyModal,
} as Meta

const Template: Story<Props> = (args) => <SlipVerifyModal {...args} />

export const Default = Template.bind({})
Default.args = {
  slipPercent: 30,
}
