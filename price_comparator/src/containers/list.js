import React from 'react'
import { connect } from 'react-redux'
import {selectProduct, updateProduct, clearProducts} from '../reducers/List'
import {clearDetails} from '../reducers/Home'
import CreateListComponent from '../components/createList'

function CreateListContainer ({history, selectProd, selectedProducs, updateProd, clearStore}) {
  return(
    <CreateListComponent
    history = {history}
    selectedProducs = {selectedProducs}
    selectProduct = {(prod) => {selectProd(prod, history)}}
    updateProduct = {(prodArray) => {updateProd(prodArray)}}
    clearStore = {() => {clearStore()}}
    />
  );
}

const mapStateToProps = function(state) {
  return {
    selectedProducs: state.list.selectedProducts || []
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectProd : (prod, history) => {dispatch(selectProduct(prod, history))},
    updateProd : (prodArray) => {dispatch(updateProduct(prodArray))},
    clearStore : () => {
      dispatch(clearProducts())
      dispatch(clearDetails())
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateListContainer);
