const debug = require('debug')('matrx:routes')

import {connected} from './stores'

import {wrap} from 'svelte-spa-router'

import Home from './routes/Home'
import Login from './routes/Login'

import Plan from './routes/Plan/index'
import Progress from './routes/Progress'

import NotFound from './routes/NotFound'

import TestJig from './routes/TestJig'

// TODO: Clean up below once we have it all working
import Name from './routes/Name'
import Wild from './routes/Wild'
import Poc from './routes/Poc'
import Morgan from './routes/Morgan'

const routes = {
  // Real routes
  '/': wrap(
    Home,
    {allowUnauthenticated: true}
  ),
  '/login': wrap(
    Login,
    {allowUnauthenticated: true}
  ),
  '/plan': wrap(
    Plan,
    {navbarLabel: 'Plan'}
  ),
  '/progress': wrap(
    Progress,
    {navbarLabel: 'Progress'}
  ),

  // Don't delete. Required for Cypress testing
  '/test-jig': TestJig,

  // TODO: Clean up below once we know have examples of all
  '/poc': Poc,
  '/hello/:first/:last?': Name,  // Using named parameters, with last being optional
  '/wild': Wild,
  '/wild/*': Wild,  // Wildcard parameter
  '/morgan': Morgan,

  // Don't delete. Must be last
  '*': NotFound,  // Catch-all, must be last
}

export default routes
