import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Home from './home'
import CreateListContainer from './list';
import ProductContainer from './productPage';
import CartContainer from './cartPage'

const App = () => (
  <div>
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/list/:productname" component={ProductContainer} />
        <Route exact path="/list" component={CreateListContainer} />
        <Route exact path="/cart" component={CartContainer} />
    </Switch>
  </div>
)

export default App
