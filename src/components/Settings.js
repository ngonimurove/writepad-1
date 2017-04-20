import React from 'react';
import { Layout, Card } from 'antd';

const cardStyle = {
    margin: '0 auto', 
    width: '90%', 
    backgroundColor: '#fff', 
    border: '1px solid #ccc',
};


class Settings extends React.Component {
    render () {
        return (
            <Layout style={{ marginTop: '80px', width: '100%', padding: '0', bottom: '50px', height: '100%' }}>
                <Card title="Settings" bordered={false} style={cardStyle} >
                    <p>Settings page</p>
                </Card>
            </Layout>
        );
    }
}

export default Settings;