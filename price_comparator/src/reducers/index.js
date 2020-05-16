import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import {stores} from './Home'
import {list} from './List'


const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  stores,
  list
})

export default createRootReducer
