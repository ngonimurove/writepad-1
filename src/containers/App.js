import React from 'react';
import HeaderContainer from '../containers/HeaderContainer';
import NotebookContainer from '../containers/NotebookContainer';
import AccessContainer from '../containers/AccessContainer';
import { Layout } from 'antd';
import '../App.css';

class App extends React.Component {

  render () {
    const isLoggedIn = false;

    return (
      <Layout style={{
        height: '100%',
        margin: '0 auto'}}>
        <HeaderContainer />
        {isLoggedIn ? <NotebookContainer /> : <AccessContainer />}
      </Layout>
    )
  }
};

export default App;
