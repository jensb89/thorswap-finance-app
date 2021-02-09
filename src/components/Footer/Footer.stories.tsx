import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import Footer, { Props } from './Footer'

export default {
  title: 'Components/Footer',
  component: Footer,
} as Meta

const Template: Story<Props> = (args) => <Footer {...args} />

export const Default = Template.bind({})
Default.args = {}
