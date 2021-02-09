import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import Collapse, { Props } from './Collapse'

export default {
  title: 'Components/Collapse',
  component: Collapse,
} as Meta

const Template: Story<Props> = (args) => <Collapse {...args} />

export const Default = Template.bind({})
Default.args = {
  data: [
    {
      title: 'some title',
      content: 'some content',
    },
  ],
}
