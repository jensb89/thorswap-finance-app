import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { ThemeProvider } from 'styled-components'
import { withThemes } from '@react-theming/storybook-addon'

import { AppHolder } from '../src/settings/appStyle'
import { lightTheme, darkTheme } from '../src/settings'

import 'antd/dist/antd.css'
import '../src/settings/appStyle/global.css'

const providerFn = ({ theme, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <AppHolder>{children}</AppHolder>
    </ThemeProvider>
  )
}

export const decorators = [
  withThemes(null, [lightTheme, darkTheme], { providerFn }),
  (Story) => (
    <Router>
      <Route path="/" component={Story} />
    </Router>
  ),
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}
