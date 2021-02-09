import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import PageLoader from './PageLoader'

export default {
  title: 'Components/PageLoader',
  component: PageLoader,
} as Meta

const Template: Story = (args) => <PageLoader {...args} />

export const Default = Template.bind({})
Default.args = {}
