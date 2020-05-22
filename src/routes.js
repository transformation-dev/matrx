import Home from './routes/Home'
import Name from './routes/Name'
import Wild from './routes/Wild'
import NotFound from './routes/NotFound'
import Login from './routes/Login'
import Poc from './routes/Poc'
import TestJig from './routes/TestJig'
import Morgan from './routes/Morgan'
import Plan from './routes/Plan/index'

const routes = {
  '/': Home,
  '/brand': Home,  // an alternative for home
  '/login': Login,
  '/poc': Poc,
  '/hello/:first/:last?': Name,  // Using named parameters, with last being optional
  '/wild': Wild,
  '/wild/*': Wild,  // Wildcard parameter
  '/test-jig': TestJig,
  '/morgan': Morgan,
  '/plan': Plan,
  '*': NotFound,  // Catch-all, must be last
}

export default routes
