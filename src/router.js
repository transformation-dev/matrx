const debug = require('debug')('matrx:router')

import {location} from 'svelte-spa-router'
import {derived, get} from 'svelte/store'
import {readyToGo} from './stores'

// Real Routes
import Home from './routes/Home'
import Login from './routes/Login'
import Plan from './routes/Plan/index'
import Progress from './routes/Progress'
import NotFound from './routes/NotFound'

// Not real but don't delete. Needed for testing
import TestJig from './routes/TestJig'

// TODO: Clean up below once we have it all working
import Poc from './routes/Poc'
import Morgan from './routes/Morgan'

export const routes = new Map(Object.entries({
  // Real routes
  '/': {component: Home, allowUnauthenticated: true},
  '/login': {component: Login, allowUnauthenticated: true},
  '/plan': {component: Plan, navbarLabel: 'Plan'},
  '/progress': {component: Progress, navbarLabel: 'Progress'},

  // Don't delete. Required for Cypress testing
  '/test-jig': TestJig,

  // TODO: Clean up below once we know have examples of all
  '/poc': {component: Poc, allowUnauthenticated: true},
  '/morgan': Morgan,

  // Don't delete
  '*': NotFound,  // Catch-all
}))

debug('routes: %O', routes)
debug('$location: %O', get(location))
debug('$readyToGo: %O', get(readyToGo))

export const activeComponent = derived(
  [location, readyToGo],
  ([$location, $readyToGo]) => {
    debug('Inside activeComponent derivation callback. $location: %O, $readyToGo: %O', $location, $readyToGo)
    const routeValue = routes.get($location)
    if (!routeValue) {
      return routes.get('*').component || routes.get('*')
    }
    const component = routeValue.component || routeValue
    if (routeValue.allowUnauthenticated || $readyToGo === 'ready') {
      return component
    } else {
      return Login
    }
  },
  Login
)
