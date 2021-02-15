import React from 'react'

// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { dataSource, columns } from './data'
import { Table, Props } from './Table'

export default {
  title: 'Components/Table',
  component: Table,
} as Meta

const Template: Story<Props> = (args) => <Table {...args} />

export const Default = Template.bind({})
Default.args = {
  dataSource,
  columns,
}
