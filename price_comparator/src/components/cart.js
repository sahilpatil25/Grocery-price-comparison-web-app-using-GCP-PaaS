import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Breadcrumb, Card, Col, Row } from 'antd';
import Slider from './Menu'
import _ from 'lodash'
import './cart.css'

const {Header, Content} = Layout;

class CartComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
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
          <div className = "cart">
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
                    <Breadcrumb.Item>Cart</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                  <div className="site-card-wrapper">
                    <Row gutter={16}>
                    {
                      this.props.data && this.props.data.map((data,index) => {
                        return (
                              <Col span={8} key={index}>

                                <Card title={data.store_name} bordered={false} style={{ width: 300 }} hoverable = {true}>
                                  {
                                    data.products.map((item, i) => {
                                        return (
                                          <div className='product-element' key={i}>
                                            <p>
                                            <i>{item.item_name + ' ' + item.brand + ' ' + item.quantity_per_item + ': '}</i>
                                            <b>{item.quantity_selected}</b>
                                            </p>
                                            <p><span className='cost-span'>Price: $</span><span className='cost-price-span'>{item.price}</span></p>
                                          </div>
                                        )
                                    })
                                  }
                                  <p><span className='totalcost-span'>Total Cost: $</span><span className='totalcost-price-span'>{data.total_cost}</span></p>
                                </Card>
                              </Col>
                        )
                      })
                    }
                  </Row>
                  </div>
                </div>
                </Content>
            </div>
          </div>
        );
    }
}

export default CartComponent
