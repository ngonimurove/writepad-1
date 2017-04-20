import React from 'react';
import { Layout, Card } from 'antd';

const cardStyle = {
    margin: '0 auto', 
    width: '90%', 
    backgroundColor: '#fff', 
    border: '1px solid #ccc',
};


class Export extends React.Component {
    render () {
        return (
            <Layout style={{ marginTop: '80px', width: '100%', padding: '0', bottom: '50px', height: '100%' }}>
                <Card title="Export" bordered={false} style={cardStyle} >
                    <p>Export page</p>
                </Card>
            </Layout>
        );
    }
}

export default Export;