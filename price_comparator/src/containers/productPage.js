import React from 'react'
import { connect } from 'react-redux'
import {selectProduct, updateProduct, clearProducts, processCheckout} from '../reducers/List'
import {clearDetails} from '../reducers/Home'
import ProductComponent from '../components/product'

function ProductContainer ({history, selectProd, selectedProducts, updateProd, match, productsList, clearStore, checkout}) {
  return(
    <ProductComponent
    history = {history}
    selectedProducts = {selectedProducts}
    selectProduct = {(prod) => {selectProd(prod, history)}}
    updateProduct = {(prodArray, prod, index) => {updateProd(prodArray, prod, index)}}
    productsList = {productsList}
    matchURL = {match}
    clearStore = {() => {clearStore()}}
    onCheckout = {() => checkout(history)}
    />
  );
}

const mapStateToProps = function(state) {
  return {
    selectedProducts: state.list.selectedProducts || [],
    productsList : state.list.products || []
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectProd : (prod, history) => {dispatch(selectProduct(prod, history))},
    updateProd : (prodArray, prod, index) => {dispatch(updateProduct(prodArray, prod, index))},
    clearStore : () => {
      dispatch(clearProducts())
      dispatch(clearDetails())
    },
    checkout: (history) => {dispatch(processCheckout(history))}
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductContainer);
