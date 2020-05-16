import React from 'react';
import 'antd/dist/antd.css';
import {PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import { Layout, Breadcrumb, Button, Card, Col, Row } from 'antd';
import Slider from './Menu'
import _ from 'lodash'
import img from '../resources/cart.jpg'
import './cart.css'

const {Header, Content } = Layout;
const { Meta } = Card;

class ProductComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    addQuantity = (value) => {

      let array = this.props.productsList
      let index = _.findIndex(array, {product_id: value});
      if(index !== -1) {
        let quantity = parseInt(array[index].productQuantity);
        let newQuantity = quantity+ 1;
        array.splice(index, 1, {...array[index], productQuantity: newQuantity});
      }
      this.props.updateProduct(array, array[index], value);
    }
    removeQuantity = (value) => {
      let array = this.props.productsList
      var index = _.findIndex(array, {product_id: value});
      if(index !== -1){
        let quantity = parseInt(array[index].productQuantity)
        let newQuantity =(quantity > 0) ? quantity- 1 : 0 ;
        array.splice(index, 1, {...array[index], productQuantity: newQuantity});
      }
      this.props.updateProduct(array,array[index], value);
    }
    render() {
      const leftMenu = {
        float: 'left'
      };
      const content = {
        marginLeft : '17%',
        width: '80%'
      };
      const products = {
        fontSize: '18px',
        width: '75%',
        padding: '10px'

      };
      const quantity = {
        float: 'left',
      };
      var myColTitleStyle = {
        textOverflow: 'ellipsis',
        // overflow: "hidden",
        whiteSpace: 'nowrap',
        marginTop: 10
      };
      const disableCheckout = this.props.selectedProducts && this.props.selectedProducts.length === 0
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
                    <Breadcrumb.Item>{this.props.matchURL.params.productname}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                  <div className="site-card-wrapper">
                      <Row gutter={16}>
                      {
                        (this.props.productsList.length === 0 ) ? "Product list could not be loaded" :
                        this.props.productsList && this.props.productsList.map((value, index) => {
                          return (
                                <Col span={8} key={index} style = {myColTitleStyle}>
                                <Card cover={<img alt="example" src={img}/>} hoverable = {true}>
                                  <Meta title={value.brand + '\n ' + value.product_name} description={'quantity: ' + value.quantity} bordered={false}/>
                                  <div className = "quantity" style = {quantity}>
                                    <MinusCircleTwoTone style={{ padding: '20px 20px 20px 90px'} } onClick = {() => this.removeQuantity(value.product_id)}/>
                                      {value.productQuantity}
                                    <PlusCircleTwoTone  style={{ padding: '20px 40px 20px 20px'}} onClick = {() => this.addQuantity(value.product_id)}/>
                                  </div>
                                </Card>
                                </Col>
                          )
                        })
                      }
                      </Row>
                  </div>
                  </div>
                  <div>
                    <Button type='primary' style = {{marginLeft : '50%'}} disabled = {disableCheckout} onClick={() => this.props.onCheckout()}> Checkout </Button>
                  </div>
              </Content>
            </div>
          </div>
        );
    }
}

export default ProductComponent
