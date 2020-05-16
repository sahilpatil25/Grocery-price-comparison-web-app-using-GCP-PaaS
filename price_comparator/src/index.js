import { Provider } from 'react-redux'
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './configureStore'
import App from './containers/App'
import ReactDOM from 'react-dom';
import React from 'react';
import './index.css'

const store = configureStore([])

ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router>
        <Switch>
          <Route path="/" component = {App}/>
        </Switch>
      </Router>
    </ConnectedRouter>
  </Provider>),
  document.getElementById('root')
)
