import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk';

export const history = createBrowserHistory()

export default function configureStore([preloadedState]) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
        createLogger()
      ),
    ),
  )

  return store
}
