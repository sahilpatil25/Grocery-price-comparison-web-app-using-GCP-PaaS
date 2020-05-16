import {SET_PRODUCTS, UPDATE_PRODUCTS, PRODUCTS_LIST, CLEAR_PRODUCTS, CHECKOUT_LIST} from '../constants/ActionTypes'
import _ from 'lodash'
import axios from 'axios';
//import productdata from '../mockData/products.json'
//import potatoes from '../mockData/potatos.json'
//import { history } from '../configureStore'

export function list (state ={}, action){
  switch (action.type){
    case SET_PRODUCTS:
      return Object.assign({}, state,{selectedProducts: action.data });
    case UPDATE_PRODUCTS:
      return _.merge({}, state,{products: action.data });
    case PRODUCTS_LIST:
      return Object.assign({}, state,{products: action.data });
    case CLEAR_PRODUCTS:
      return Object.assign({}, state,{products:[], selectedProducts:[], cartList: []});
    case CHECKOUT_LIST:
      return Object.assign({}, state,{cartList: action.data});
    default:
      return state
  }
}

const setSelectedProducts = (data) => {
  return {
    type : SET_PRODUCTS,
    data
  }
}

export const clearProducts = () => {
  return {
    type : CLEAR_PRODUCTS
  }
}

const updateSelectedProducts = (data) => {
  return {
    type : UPDATE_PRODUCTS,
    data
  }
}

const productList = (data) => {
  return {
    type : PRODUCTS_LIST,
    data
  }
}

const checkoutList = (data) => {
  return {
    type: CHECKOUT_LIST,
    data
  }
}
export const selectProduct = (prod, history) => {
  return (dispatch, getState) => {
    let state = getState()
    let array = state.list.selectedProducts || [];
    let storesArray = []
    state.stores.setStores  && state.stores.setStores.forEach((item, index) => {
      storesArray.push(item.name);
    })
    axios.post('https://cse546-276620.uc.r.appspot.com/get_products/',{
      "product_type" : prod,
      "stores" : storesArray
    })
        .then(res => {
          //dispatch(storeDetails(res));
          history.push('/list/'+prod.toLowerCase());
          let prodData = [];
          res.data.forEach((item) => {
            var indexValue = _.findIndex(array, {product_id: item.product_id});
            if(indexValue !== -1) {
              prodData.push({
                ...item,
                productQuantity : array[indexValue].productQuantity
              })
            }
            else {
              prodData.push({
                ...item,
                productQuantity : 0
              })
            }
          })
          dispatch(productList(prodData))
        }, error =>{
          console.log("error");
        })
  }
}

export const updateProduct = (prodArray, prod, index) => {
  return (dispatch, getState) => {
    let state = getState();
    dispatch(updateSelectedProducts(prodArray));
    let array = state.list.selectedProducts || [];
    var indexValue = _.findIndex(array, {product_id: index});
    if(indexValue !== -1){
       array.splice(indexValue, 1)

    }
    if (prod.productQuantity > 0)
    {
      array.push(prod);
    }
    dispatch(setSelectedProducts(array));

  }
}

export const processCheckout = (history) => {
  return(dispatch, getState) => {
    let state = getState();
    let array = []
    let cart = state.list.selectedProducts;
    cart.map((val, index) => {
      array.push({
        "item_id": val.product_id,
        "quantity": val.productQuantity
      })
    })

    let storesArray = []
    state.stores.setStores  && state.stores.setStores.forEach((item, index) => {
      storesArray.push(item.name);
    })

    axios.post('https://cse546-276620.uc.r.appspot.com/get_comparison/',{
      "products" : array,
      "stores" : storesArray
    })
        .then(res => {
          //dispatch(storeDetails(res));
          history.push('/cart');
          let data = _.orderBy(res.data, ['value_rank'],['asc'])
          dispatch(checkoutList(data))
        }, error =>{
          console.log("error");
        })
  }
}
