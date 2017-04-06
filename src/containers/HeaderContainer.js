import React from 'react';
import Title from '../components/Title';
import Login from '../components/Login';
import { Layout } from 'antd';
const { Header } = Layout;

const HeaderContainer = () => (
    <Header style={{ position: 'fixed', width: '100%', padding: '0', height: 'auto' }}>
      <Title />
      <Login />   
    </Header>
    );

export default HeaderContainer;