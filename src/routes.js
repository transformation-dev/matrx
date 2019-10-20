import Home from './routes/Home.svelte'
import Name from './routes/Name.svelte'
import Wild from './routes/Wild.svelte'
import NotFound from './routes/NotFound.svelte'
import Login from './routes/Login.svelte'
import Poc from './routes/Poc.svelte'
import TestJig from './routes/TestJig.svelte'

const routes = {
  '/': Home,
  '/brand': Home,  // an alternative for home
  '/login': Login,
  '/poc': Poc,
  '/hello/:first/:last?': Name,  // Using named parameters, with last being optional
  '/wild': Wild,
  '/wild/*': Wild,  // Wildcard parameter
  '/test-jig': TestJig,
  '*': NotFound,  // Catch-all, must be last
}

export default routes
