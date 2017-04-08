import React from 'react';
import Title from '../components/Title';
// import Login from '../components/Login';
import { Layout, Menu, Icon } from 'antd';
const { Header } = Layout;

const IconStyle = {
  width: '50px',
  height: '50px'
}
const IconStyleRight = {
  width: '50px',
  height: '50px',
  float: 'right'
}

const isLoggedIn = true;

const HeaderContainer = () => (
    <Header style={{ position: 'fixed', width: '100%', padding: '0', height: 'auto' }}>
      <Title />
      { isLoggedIn ? 
      <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}>
          <Menu.Item key="1" style={IconStyle}><Icon type="folder-open" /></Menu.Item>
          <Menu.Item key="2" style={IconStyle}><Icon type="file-add" /></Menu.Item>
          <Menu.Item key="3" style={IconStyle}><Icon type="export" /></Menu.Item>
          <Menu.Item key="4" style={IconStyleRight}><Icon type="logout" /></Menu.Item>
          <Menu.Item key="5" style={IconStyleRight}><Icon type="setting" /></Menu.Item>
      </Menu>
      :
      <div></div> }
    </Header>
    );

export default HeaderContainer;