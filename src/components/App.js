import React from 'react';
import HeaderContainer from '../containers/HeaderContainer';
import NotebookContainer from '../containers/NotebookContainer';
import AccessContainer from '../containers/AccessContainer';
import { Layout } from 'antd';
import '../App.css';



const App = () => {
  const isLoggedIn = true;

  return (
    <Layout style={{
      height: '100%',
      margin: '0 auto'}}>
      <HeaderContainer />
      {isLoggedIn ? <NotebookContainer /> : <AccessContainer />}
    </Layout>
  )
};

export default App;
