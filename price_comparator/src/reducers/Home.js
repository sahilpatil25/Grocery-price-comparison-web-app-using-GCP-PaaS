import {GET_STORES, SET_STORES, CLEAR_STORES} from '../constants/ActionTypes'
import axios from 'axios';
//import Stores from '../mockData/stores'
//import _ from 'lodash'

export function stores (state ={}, action){
  switch (action.type){
    case GET_STORES:
      return Object.assign({}, state, {stores: action.data} );
    case SET_STORES:
      return Object.assign({}, state, {setStores: action.data} );
    case CLEAR_STORES:
      return Object.assign({}, state, {stores: [], setStores:[]} );
    default:
      return state
  }
}
 export const clearDetails = (data) => {
  return {
    type : CLEAR_STORES
  }
}

 const storeDetails = (data) => {
  return {
    type : GET_STORES,
    data
  }
}


export const getStores = (radius, latitude, longitude) => {
  return (dispatch, getState) => {
    //let storeValues= getState()
    axios.get(`https://cse546-276620.uc.r.appspot.com/function/`,{
          params : {
            location : latitude +',' + longitude,
            radius: radius* 1600
          }
        },
       { crossdomain: true })
        .then(res => {
          dispatch(storeDetails(res.data));
        })
  }

}

//create a function as above that was dispatched in container
//In this function dispatch an action
const setSelectedStores = (data) => {
  return {
    type: SET_STORES,
    data
  }
}

export const setStores = (selectedStores) => {
  return (dispatch, getState) => {
    dispatch(setSelectedStores(selectedStores))
  }
}
