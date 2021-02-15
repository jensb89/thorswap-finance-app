import React, { Suspense, lazy } from 'react'

import { Router, Route, Switch } from 'react-router'

import { Layout, PageLoader, BackLink } from 'components'

import { history } from 'helpers/history'

import {
  HOME_ROUTE,
  CONNECT_WALLET_ROUTE,
  CREATE_WALLET_ROUTE,
} from 'settings/constants'

export type Routes = {
  exact?: boolean
  path?: string | string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: any
}[]

const routes: Routes = [
  {
    exact: true,
    path: HOME_ROUTE,
    component: lazy(() => import('views/Home')),
  },
  {
    exact: true,
    path: CONNECT_WALLET_ROUTE,
    component: lazy(() => import('views/Connect')),
  },
  {
    exact: true,
    path: CREATE_WALLET_ROUTE,
    component: lazy(() => import('views/CreateWallet')),
  },
]

const PublicRoutes = () => (
  <Router history={history}>
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {routes.map((route, index) => {
          const Component = route.component

          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Layout>
                  {route.path !== HOME_ROUTE && <BackLink />}
                  <Component {...props} />
                </Layout>
              )}
            />
          )
        })}
      </Switch>
    </Suspense>
  </Router>
)

export default PublicRoutes
