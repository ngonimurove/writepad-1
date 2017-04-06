import React from 'react';
import HeaderContainer from '../containers/HeaderContainer';
import NotebookContainer from '../containers/NotebookContainer';
import { Layout } from 'antd';

const App = () => (
    <Layout style={{
      height: '100%',
      margin: '0 auto'}}>
      <HeaderContainer />
      <NotebookContainer />
    </Layout>
);

export default App;
