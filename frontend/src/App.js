import React, { lazy } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'
import Dashboard from './pages/Dashboard'

const Layout = lazy(() => import('./containers/Layout'))

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          {/* Place new routes over this */}
          <Route path="/" component={Layout} />
          {/* If you have an index page, you can remothis Redirect */}
        </Switch>
      </Router>
    </>
  )
}

export default App
