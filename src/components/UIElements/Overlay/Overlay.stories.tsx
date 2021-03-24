import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { Overlay, OverlayProps } from './Overlay'

export default {
  title: 'Components/Overlay',
  component: Overlay,
} as Meta

const Template: Story<OverlayProps> = (args) => (
  <Overlay {...args}>Modal content</Overlay>
)

export const Default = Template.bind({})
Default.args = {
  isOpen: true,
  maxHeight: 100,
}
