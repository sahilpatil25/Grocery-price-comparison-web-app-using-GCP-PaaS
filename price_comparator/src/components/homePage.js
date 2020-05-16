import React from 'react'
import 'antd/dist/antd.css';
import { Slider, InputNumber, Row, Col, Checkbox } from 'antd';
import { Layout, Breadcrumb, Button} from 'antd';
import {  HomeOutlined, SearchOutlined } from '@ant-design/icons';


const { Header, Content, Footer } = Layout;


class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radius: 1,
      latitude : 0,
      longitude: 0,
      checkboxArray: []
    };
  }

  onChange =  (value) => {
    this.setState({
      radius: value
    })
  }

  onChangeBox = (e, i) => {
    let checkBoxCurrentState = this.state.checkboxArray;
    checkBoxCurrentState[i] = !checkBoxCurrentState[i];
    this.setState({
      checkboxArray: checkBoxCurrentState
    });
  };

  //Create function that runs on onclick of button
  //Array filter and create list to store
  //Call prop function with array as parameter
  onSetStoresClick = () => {
    let selected =  this.props.data &&  this.props.data.filter((e, i) => {
      if(this.state.checkboxArray[i])
        return true;

      return false;
    })
    this.props.setStores(selected);

  }

  position = async () => {
    await navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        console.log("location",this.state.latitude , this.state.longitude )
      }
      ,
      err => console.log(err)
    );
  }
  render (){
    const disabled = (this.state.latitude === 0 && this.state.longitude === 0 );
    const disableSubmit = this.props.data && this.props.data.length === 0
    const display = {
      display: (disabled) ? 'none': 'block'
    }
    const search = {
      display: (disableSubmit) ? 'none': 'block'
    }
    return (
      <>
        <Layout className="layout">
          <Header style={{ fontSize: '1.5rem', color: '#fff' }}>
          You shop, we save!
          </Header>
          <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Select stores</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">
          <Row>
            <Col span={24}>
              <div className="separation-div">
                <h1> Detect location to start using the Price Comparator</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <div className="text-description">Select distance</div>
            </Col>
            <Col span={12}>
              <Slider
                min={0}
                max={5}
                defaultValue={1}
                onChange={this.onChange}
                value={typeof this.state.radius === 'number' ? this.state.radius : 0}
              />
            </Col>
            <Col span={6}>
                <InputNumber
                  min={1}
                  max={5}
                  style={{ margin: '0 16px' }}
                  value={this.state.radius}
                  onChange={this.onChange}
                />
                miles
            </Col>
          </Row>
          <Row>
            <Col span = {6}></Col>
            <Col span = {8}>
              <Button block onClick={this.position}> Detect location </Button>
            </Col>
            <Col span={1}></Col>
            <Col span={3}>
              <Button type="primary" icon={<SearchOutlined />} disabled = {disabled} onClick={() => this.props.change(this.state.radius, this.state.latitude, this.state.longitude )}>
                  Search
              </Button>
            </Col>
            <Col span={6}></Col>
          </Row>
          <Row>
            <Col span={6}></Col>
            <Col span={8}>
              <i className='location' style={display}>Your location is : {this.state.latitude + ',' + this.state.longitude}</i>
            </Col>
          </Row>
          <Row>
            <div className="separation-div"></div>
          </Row>
          <Row>
            <Col span={6}></Col>
            <Col span={12}>
            <h2 style={search} >Select stores to shop from</h2>
            {
              this.props.data && this.props.data.map((data,index) => {
              return (
                <div className="store-item"  key = {index}>
                  <Row>
                    <Col span = {2}>
                      <Checkbox
                        checked={this.state.checkboxArray[index] ? true : false}
                        onChange={e => this.onChangeBox(e, index)}
                        value={index}
                      >
                      </Checkbox>
                    </Col>
                    <Col span = {22}>
                      <Row>
                        <b>Store name</b> <i>{':  ' + data.name}</i>
                      </Row>
                      <Row>
                        <b>Address</b> <i>{':  ' + data.address}</i>
                      </Row>
                      <Row>
                        <b>Distance</b> <i>{':  ' + data.distance}</i>
                      </Row>
                      <Row>
                        <b>ETA</b> <i>{':  ' + data.ETA}</i>
                      </Row>
                    </Col>
                  </Row>
                </div>
              )
            })}
            </Col>
          </Row>
          <Row>
            <Col span={18} style={search} ></Col>
            <Col span={2} style = {{marginLeft: '-30%'}}>
              <Button type='primary' disabled= {disableSubmit}  block onClick={() => this.onSetStoresClick()}> Submit </Button>
            </Col>
          </Row>
          </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}></Footer>
          </Layout>

        </>

    );
  }
}
export default HomePage;
