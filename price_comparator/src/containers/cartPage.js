import React from 'react'
import { connect } from 'react-redux'
import CartComponent from '../components/cart'
import {getStores, setStores} from '../reducers/Home'
import {selectProduct, clearProducts} from '../reducers/List'
import {clearDetails} from '../reducers/Home'
import cartList1 from '../mockData/cart.json'

function CartContainer ({cartList, history, clearStore, selectProd}) {
  return (<CartComponent
    data = {cartList}
    history = {history}
    clearStore = {() => {clearStore()}}
    selectProduct = {(prod) => {selectProd(prod, history)}}
  />);

}


const mapStateToProps = function(state) {
  return {
    cartList: state.list.cartList || []
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectProd : (prod, history) => {dispatch(selectProduct(prod, history))},
    clearStore : () => {
      dispatch(clearProducts())
      dispatch(clearDetails())
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CartContainer);
