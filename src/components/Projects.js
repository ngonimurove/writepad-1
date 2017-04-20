import React from 'react';
import { Layout, Table, Icon, Card, Button } from 'antd';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import _ from 'lodash';

const { pathToJS, dataToJS } = helpers;

const columns = [{
  title: 'Project Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Owner',
  dataIndex: 'owner',
  key: 'owner',
}, {
  title: 'Actions',
  key: 'actions',
  render: (text, record) => (
    <span>
      <a href="#"><Icon type="user-add" /></a>
      <span className="ant-divider" />
      <a href="#"><Icon type="delete" /></a>
    </span>
  ),
}];

// const projectData = [{
//   key: '1',
//   name: 'A Tale of Two Cities',
//   owner: 'Charles Dickens',
// }, {
//   key: '2',
//   name: 'Warbreaker',
//   owner: 'Brandon Sanderson',
// }, {
//   key: '3',
//   name: 'The People',
//   owner: 'Taps Murove',
// }];

const cardStyle = {
    margin: '0 auto', 
    width: '90%',
    height: 'auto', 
    backgroundColor: '#fff', 
    border: '1px solid #ccc',
};

@firebase((props) => {
    return ([
        'users',
        ['projects']
    ]);
})
@connect(
    (state, props) => {
        return ({
        auth: pathToJS(state.firebase, 'auth'),
        projects: dataToJS(state.firebase, 'projects'),
        })}
)
class Projects extends React.Component {
    render () {

        const { firebase, auth, projects } = this.props;


        const handleNewProject = () => {
            firebase.push('/projects', {owner: auth.uid , name: 'Untitled', content: {block: ['this', 'is', 'that']}})
        };

        const projectList = () => {
            const list = _.values(projects);
            return list;
        }
        console.log(projectList())

        return (
            <Layout style={{ marginTop: '80px', width: '100%', padding: '0', bottom: '50px', height: 'auto' }}>
                <Card title="Projects" bordered={false} style={cardStyle} >
                    <Button style={{marginBottom: '15px'}} onClick={handleNewProject}>New Project</Button>
                    <Table style={{height: '200px'}} pagination={{ pageSize: 8 }} columns={columns} dataSource={projectList()} />
                </Card>
            </Layout>)
    };
};

export default Projects;