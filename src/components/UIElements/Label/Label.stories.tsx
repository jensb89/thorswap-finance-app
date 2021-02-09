import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import Label, { Props } from './Label'

export default {
  title: 'Components/Label',
  component: Label,
} as Meta

const Template: Story<Props> = (args) => <Label {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Label Text',
}
