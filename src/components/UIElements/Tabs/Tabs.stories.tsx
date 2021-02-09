import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import Tabs, { TabPane, Props } from './Tabs'

export default {
  title: 'Components/Tabs',
  component: Tabs,
} as Meta

const Template: Story<Props> = (args) => {
  return (
    <Tabs activeKey="1" {...args}>
      <TabPane tab="Swap" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Pools" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="Trade" key="3">
        Content of Tab Pane 3
      </TabPane>
    </Tabs>
  )
}

export const Default = Template.bind({})
Default.args = {
  withBorder: true,
}
