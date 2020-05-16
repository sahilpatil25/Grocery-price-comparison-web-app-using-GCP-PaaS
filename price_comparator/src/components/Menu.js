import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

const { SubMenu } = Menu;

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleClick = e => {
    if (e.key === "Home") {
      this.props.history.push('/');
      this.props.clearStore();
    }
    else {

      this.props.selectProduct(e.key);
    }
  };



  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['Home']}
        defaultOpenKeys={['Produce']}
        mode="inline"
      >
        <Menu.Item key="Home">Home</Menu.Item>
        <SubMenu
          key="Produce"
          title={
            <span>
              <span>Produce</span>
            </span>
          }
        >
          <Menu.ItemGroup key="Vegetables" title="Vegetables">
            <Menu.Item key="Tomatoes">Tomatoes</Menu.Item>
            <Menu.Item key="Onions">Onions</Menu.Item>
            <Menu.Item key="Potatoes">Potatoes</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup key="Fruits" title="Fruits">
            <Menu.Item key="Apples">Apples</Menu.Item>
            <Menu.Item key="Grapes">Grapes</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
        <SubMenu key="Dairy" title="Dairy">
          <Menu.Item key="Milk">Milk</Menu.Item>
          <Menu.Item key="Eggs">Eggs</Menu.Item>
          <Menu.Item key="Cheese">Cheese</Menu.Item>
          <Menu.Item key="Yogurt">Yogurt</Menu.Item>
        </SubMenu>
        <SubMenu key="Bakery" title="Bakery">
          <Menu.Item key="Bread">Bread</Menu.Item>
          <Menu.Item key="Cookies">Cookies</Menu.Item>
          <Menu.Item key="Bagels">Bagels</Menu.Item>
        </SubMenu>
        <SubMenu key="Meat" title="Meat">
          <Menu.Item key="Chicken">Chicken</Menu.Item>
          <Menu.Item key="Fish">Fish</Menu.Item>
          <Menu.Item key="Bacon">Bacon</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default Slider;
