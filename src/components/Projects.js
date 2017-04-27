import React from 'react';
import { Layout, Table, Card, Button, Popconfirm, Input, Icon } from 'antd';
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

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        key: this.props.key,
        editable: false,
    };
    
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    };

    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
        this.props.onChange(this.state.value);
        }
    };

    edit = () => {
        this.setState({ editable: true });
    }; 

    render() {
        const { value, editable } = this.state;
        return (
        <div className="editable-cell">
            {
            editable ?
                <div className="editable-cell-input-wrapper">
                <Input
                    value={value}
                    onChange={this.handleChange}
                    onPressEnter={this.check}
                />
                <Icon
                    type="check"
                    className="editable-cell-icon-check"
                    onClick={this.check}
                />
                </div>
                :
                <div className="editable-cell-text-wrapper">
                {this.props.children}
                <Icon
                    type="edit"
                    className="editable-cell-icon"
                    onClick={this.edit}
                />
                </div>
            }
        </div>
        );
    }
}

@firebase((props) => {
    return ([
        'users',
        ['projects'],
        ['.info']
    ]);
})
@connect(
    (state, props) => {

        const info = dataToJS(state.firebase, '.info');

        return ({
        auth: pathToJS(state.firebase, 'auth'),
        projects: dataToJS(state.firebase, 'projects'),
        users: dataToJS(state.firebase, 'users'),
        online: info.connected,
        })}
)
class Projects extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [{
                        title: 'Project Name',
                        dataIndex: 'name',
                        key: 'name',
                        width: '30%',
                        render: (text, record, index) => (
                            <EditableCell
                            value={text}
                            onChange={this.onCellChange(record.key, 'name')}>
                                <a href="#" onClick={() => this.handleActiveProject(record.key)}>{text}</a>
                            </EditableCell>
                        ),
                        }, {
                        title: 'Owner',
                        dataIndex: 'owner',
                        key: 'owner',
                        render: (text, record) => <p>{record.ownerFullName}</p>,
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

    onCellChange = (key) => {
        const { firebase } = this.props;
        return (value) => {
            firebase.set(`/projects/${key}/name`, value);
        };
    };

    onDelete(key) {
        const { firebase } = this.props;
        firebase.remove(`/projects/${key}`);
    };

    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            const { projects, auth, users } = nextProps;

           if (auth && projects) {
                

                const userList = _.transform(users, (result, value, key) => {
                        result.push({ uid: key, firstname: value.firstname, lastname: value.lastname })
                    }, []);

                const owner = _.find(userList, {uid: auth.uid});
                const ownerFullName = owner.firstname + ' ' + owner.lastname;

                if (projects) {
                    const projectList = _.transform(projects, (result, value, key) => {
                        result.push({ key: key, name: value.name, owner: value.owner, ownerFullName: ownerFullName })
                    }, []);

                    const userProjects = _.filter(projectList, {owner: auth.uid})

                    this.setState({
                        dataSource: userProjects,
                    });
                }
            }
        } 
    };

    render () {

        const { dataSource } = this.state;
        const columns = this.columns;
         
        return (
            <Layout style={{ marginTop: '80px', width: '100%', padding: '0', bottom: '50px', height: 'auto' }}>
                <Card title="Projects" bordered={false} style={cardStyle} >
                        <div>
                            {this.props.online ?
                            <Button style={{marginBottom: '15px'}} onClick={() => this.handleNewProject()}>
                                New Project
                            </Button> :
                            ''
                            }
                            {typeof this.props.projects !== 'undefined' ? 
                                <Table
                                bordered
                                size='middle'
                                locale={{emptyText: 'Create a new project'}} 
                                style={{height: '200px'}} 
                                pagination={{ pageSize: 10 }} 
                                columns={columns} 
                                dataSource={dataSource} /> :
                                <div><Icon type="loading" /></div>}
                        </div>
                </Card>
            </Layout>)
    };
};

export default Projects;