import React from 'react';
import { Layout, Table, Card, Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { setActiveProject, setContentView } from '../actions';
import { EditorState, convertToRaw } from 'draft-js';

import _ from 'lodash';

const { pathToJS, dataToJS } = helpers;

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
    constructor(props) {
        super(props);

        this.columns = [{
                        title: 'Project Name',
                        dataIndex: 'name',
                        key: 'name',
                        render: (text, record) => <a href="#" onClick={() => this.handleActiveProject(record.key)}>{text}</a>,
                        }, {
                        title: 'Owner',
                        dataIndex: 'owner',
                        key: 'owner',
                        }, {
                        title: 'Actions',
                        key: 'actions',
                        render: (text, record, index) => (
                            <Popconfirm title="Are you sure?" onConfirm={() => this.onDelete(record.key)} okText='Confirm' cancelText='Cancel'>
                                <a href="#">Delete</a>
                            </Popconfirm>
                        ),
                    }];
        

        this.state = {
            dataSource: undefined,
        }
    };

    handleActiveProject(key) {
        this.props.dispatch(setActiveProject(key));
        this.props.dispatch(setContentView('CONTENT_NOTEBOOK'));
    };

    handleNewProject() {
        const { firebase, auth } = this.props;
        const defaultState = EditorState.createEmpty();
        firebase.push('/projects', {owner: auth.uid , name: 'Untitled', content: JSON.stringify(convertToRaw(defaultState.getCurrentContent()))});
    };

    onDelete(key) {
        const { firebase } = this.props;
        firebase.remove(`/projects/${key}`);
    };

    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            const { projects, auth } = nextProps;

            if (projects) {
                const projectList = _.transform(projects, (result, value, key) => {
                    result.push({ key: key, name: value.name, owner: value.owner })
                }, []);

                const userProjects = _.filter(projectList, {owner: auth.uid})

                console.log(userProjects);

                this.setState({
                    dataSource: userProjects,
                });
            }
        } 
    };

    render () {

        const { dataSource } = this.state;
        const columns = this.columns;
         
        return (
            <Layout style={{ marginTop: '80px', width: '100%', padding: '0', bottom: '50px', height: 'auto' }}>
                <Card title="Projects" bordered={false} style={cardStyle} >
                    <Button style={{marginBottom: '15px'}} onClick={() => this.handleNewProject()}>New Project</Button>
                    <Table
                    bordered
                    size='middle'
                    locale={{emptyText: 'Create a new project'}} 
                    style={{height: '200px'}} 
                    pagination={{ pageSize: 10 }} 
                    columns={columns} 
                    dataSource={dataSource} />
                </Card>
            </Layout>)
    };
};

export default Projects;