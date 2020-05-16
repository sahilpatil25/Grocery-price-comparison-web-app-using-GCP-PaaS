import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Breadcrumb} from 'antd';
import Slider from './Menu'
import _ from 'lodash'
import {  ShoppingCartOutlined} from '@ant-design/icons';

const { Header, Content} = Layout;

class CreateListComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    addQuantity = (value) => {

      let array = this.props.selectedProducs
      var index = _.findIndex(array, {item: value});
      let quantity = parseInt(array[index].quantity)
      let newQuantity = quantity+ 1;
      array.splice(index, 1, {item: value, quantity: newQuantity});
      this.props.updateProduct(array);
    }
    removeQuantity = (value) => {
      let array = this.props.selectedProducs
      var index = _.findIndex(array, {item: value});
      let quantity = parseInt(array[index].quantity)
      let newQuantity =(quantity > 1) ? quantity- 1 : 1 ;
      array.splice(index, 1, {item: value, quantity: newQuantity});
      this.props.updateProduct(array);
    }
    render() {
      const leftMenu = {
        float: 'left'
      };
      const content = {
        marginLeft : '17%',
        width: '80%'
      };
        return(
          <div>
            <Header style={{ fontSize: '1.5rem', color: '#fff' }}>
            You shop, we save!
            </Header>
            <div className = "leftMenu" style = {leftMenu}>
              <Slider selectProduct = {this.props.selectProduct} history = {this.props.history} clearStore = {this.props.clearStore}/>
            </div>
            <div className = "content" style = {content}>
              <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Create list</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <div className="empty-cart">
                      <h1> Your cart is empty</h1>
                      <p>Select items from menu to add</p>
                      <ShoppingCartOutlined style={{ fontSize: '2rem'}}/>
                    </div>
                </div>
                </Content>
            </div>
          </div>
        );
    }
}

export default CreateListComponent
