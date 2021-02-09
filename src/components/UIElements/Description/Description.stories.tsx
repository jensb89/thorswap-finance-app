import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import Description, { Props } from './Description'

export default {
  title: 'Components/Description',
  component: Description,
} as Meta

const Template: Story<Props> = (args) => <Description {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'title',
  value: 'value',
}
