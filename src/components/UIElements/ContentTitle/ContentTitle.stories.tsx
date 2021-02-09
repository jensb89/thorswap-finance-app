import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import ContentTitle, { Props } from './ContentTitle'

export default {
  title: 'Components/ContentTitle',
  component: ContentTitle,
} as Meta

const Template: Story<Props> = (args) => <ContentTitle {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Content Title',
}
