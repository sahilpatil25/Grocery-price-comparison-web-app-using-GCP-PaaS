import React from 'react'
import { connect } from 'react-redux'
import HomePage from '../components/homePage'
import {getStores, setStores} from '../reducers/Home'

//Add variable name used in mapdispatchtoprops
function Home ({dataStore, onChange, onSetStores, history}) {
  return (<HomePage
    data = {dataStore}
    change = {(radius, latitude, longitude) => {
      onChange(radius, latitude, longitude)
    }}
    //Add prop function that was called in function
    setStores = {(selectedStores) => {
      onSetStores(selectedStores);
      let path = `list`;
      history.push(path);
      console.log("in set stores container");
    }}
  />);

}


const mapStateToProps = function(state) {
  return {
    dataStore: state.stores.stores || []
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChange : (radius, latitude, longitude) => dispatch(getStores(radius, latitude, longitude)),
    //create a variable and dispatch reducer function
    onSetStores : (selectedStores) => {
       dispatch(setStores(selectedStores));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);
