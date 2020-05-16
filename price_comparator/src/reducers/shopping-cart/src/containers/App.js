import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Home from '../home'
import Second from '../second'
const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/next" component={Second} />
    </Switch>
  </div>
)

export default App
