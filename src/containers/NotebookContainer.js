import React from 'react';
// import Block from 'react-blocks';
import NewNote from '../components/NewNote';
import Editor from '../components/Editor';
import { Layout, Menu } from 'antd';
const { Sider, Content } = Layout;

const NotebookContainer = () => (
      <Layout style={{ marginTop: '80px', width: '100%', padding: '0', bottom: '50px', height: '100%' }}>
        <Sider width={200} style={{ background: '#fff' }}>
            <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            >
            <Menu.Item key="1">Note 1</Menu.Item>
            <Menu.Item key="2">Note 2</Menu.Item>
            <Menu.Item key="3">Note 3</Menu.Item>
            <Menu.Item key="4">Note 4</Menu.Item>
          </Menu>
         <div style={{ backgroundColor: '#fff' }}>
            <NewNote />
         </div>
        </Sider>
        <Content>
            <div style={{
                margin: '24px auto', 
                width: '90%', 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                cursor: 'text',
                minHeight: '70%',
                padding: '10px'
                }} >
                <Editor style={{height: '100%'}}/>
            </div>
        </Content>
      </Layout>
    );

export default NotebookContainer;