import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import ContentView, { Props } from './ContentView'

export default {
  title: 'Components/ContentView',
  component: ContentView,
} as Meta

const Template: Story<Props> = (args) => <ContentView {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'content',
}
