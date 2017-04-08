import React from 'react';
// import Block from 'react-blocks';
// import NewNote from '../components/NewNote';
import Editor from '../components/Editor';
import { Layout, Menu, Icon, Card } from 'antd';
const { Sider, Content } = Layout;

const NotebookContainer = () => (
      <Layout style={{ marginTop: '80px', width: '100%', padding: '0', bottom: '50px', height: '100%' }}>
        <Sider 
        width={200} 
        style={{ background: '#ececec'}}
        collapsed='true'
        >
            <Menu
            theme="light"
            mode="inline"
            >
            <Menu.Item key="1"><Icon type="edit" /></Menu.Item>
            <Menu.Item key="2"><Icon type="arrow-left" /></Menu.Item>
            <Menu.Item key="3"><Icon type="arrow-right" /></Menu.Item>
            <Menu.Item key="4"><Icon type="arrow-up" /></Menu.Item>
            <Menu.Item key="5"><Icon type="arrow-down" /></Menu.Item>
            <Menu.Item key="6"><Icon type="switcher" /></Menu.Item>
            <Menu.Item key="7"><Icon type="copy" /></Menu.Item>
            <Menu.Item key="8"><Icon type="eye" /></Menu.Item>
            <Menu.Item key="9"><Icon type="link" /></Menu.Item>
            <Menu.Item key="10"><Icon type="lock" /></Menu.Item>
          </Menu>
        </Sider>
        <Content>
            <Card style={{
                margin: '0 auto', 
                width: '80%', 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                cursor: 'text' }}
                bodyStyle={{ padding: '5px 10px' }}>
                <Editor style={{height: '100%'}}/>
            </Card>
        </Content>
      </Layout>
    );

export default NotebookContainer;