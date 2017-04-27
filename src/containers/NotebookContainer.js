import React from 'react';
import Editor from '../components/Editor';
import { Layout, Menu, Icon, Affix, Badge } from 'antd';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import Firebase from 'firebase';
import _ from 'lodash';

const { pathToJS, dataToJS } = helpers;
const { Sider, Content } = Layout;


@firebase((props) => {
    return ([
        ['projects'],
        ['.info'],
    ]);
})
@connect(
    (state, props) => {
        const info = dataToJS(state.firebase, '.info');

        return ({
        auth: pathToJS(state.firebase, 'auth'),
        projects: dataToJS(state.firebase, 'projects'),
        online: info.connected,
        projectKey: state.activeProject.key
        })}
)
class NotebookContainer extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
              projectName: <Icon type="loading" />,
              online: false,
          }
      };

      render () {
        return (
          <Layout style={{ marginTop: '60px', width: '100%', padding: '0', bottom: '50px', height: '100%' }}>
            <Affix style={{ position: 'fixed', top: 60, left: 0, width: '100%', zIndex: '1'}}>
              <div style={{ border: '1px solid #ccc',
                            backgroundColor: '#ddd', 
                            borderRadius: '15px', 
                            width: 'auto', 
                            height: 'auto',
                            margin: '0 20px',
                            padding: '5px 15px'}}>
                <Badge status={this.state.online ? "success" : "error"} text={this.state.projectName} />
              </div>
            </Affix>
            <div style={{marginTop: '35px'}}>
            <Sider 
            width={200} 
            style={{ background: '#ececec' }}
            collapsed='true'
            >
                <Affix style={{ position: 'fixed', top: 100, left: 0}}>
                <Menu
                theme="light"
                mode="inline"
                >
                <Menu.Item key="1"><Icon type="edit" /></Menu.Item>
                <Menu.Item key="2"><Icon type="arrow-up" /></Menu.Item>
                <Menu.Item key="3"><Icon type="arrow-down" /></Menu.Item>
                <Menu.Item key="4"><Icon type="switcher" /></Menu.Item>
                <Menu.Item key="5"><Icon type="copy" /></Menu.Item>
                <Menu.Item key="6"><Icon type="eye" /></Menu.Item>
                <Menu.Item key="7"><Icon type="link" /></Menu.Item>
                <Menu.Item key="8"><Icon type="lock" /></Menu.Item>
              </Menu>
              </Affix>
            </Sider>
            <Content>
            <Editor style={{height: '100%'}}/>

            </Content>
            </div>
          </Layout>
        );
    };

    componentWillUpdate(nextProps, nextState) {
      if (nextProps !== this.props) {
          const { projectKey, projects, firebase , auth} = nextProps;
          
          if ( projects ) {
              const projectList = _.transform(projects, (result, value, key) => {
                        result.push({ key: key, name: value.name, owner: value.owner, selections: value.selections, presence: value.presence, content: value.content })
                    }, []);

              const activeProject = _.find(projectList, {key: projectKey});
              if (activeProject) {
                if (nextProps.online) {
                  Firebase.database().ref(`projects/${projectKey}/presence/${auth.uid}`).onDisconnect().remove()
                  Firebase.database().ref(`projects/${projectKey}/selections/${auth.uid}`).onDisconnect().remove()
                  firebase.set(`projects/${projectKey}/presence/${auth.uid}`, true);
                }
                this.setState({
                  projectName: activeProject.name,
                  online: nextProps.online,
                });
              }                
          }
      } 
  };
};

export default NotebookContainer;