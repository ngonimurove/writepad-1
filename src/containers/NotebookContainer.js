import React from 'react';
import Editor from '../components/Editor';
import { Layout, Icon, Affix, Badge } from 'antd';
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
        online: info ? info.connected : false,
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
                            margin: '0 13px',
                            padding: '5px 15px'}}>
                <Badge status={this.state.online ? "success" : "error"} text={<a href="#">{this.state.projectName}</a>} />
              </div>
            </Affix>
            <div style={{marginTop: '35px'}}>
            <Sider 
            width={200} 
            style={{ background: '#ececec' }}
            collapsed='true'
            >
                <Affix style={{ position: 'fixed', top: 100, left: 13}}>
                  <ul className="context-menu">
                    <li><div className="context-menu-item" ><Icon type="edit" /></div></li>
                    <li><div className="context-menu-item" ><Icon type="arrow-up" /></div></li>
                    <li><div className="context-menu-item" ><Icon type="arrow-down" /></div></li>
                    <li><div className="context-menu-item" ><Icon type="switcher" /></div></li>
                    <li><div className="context-menu-item" ><Icon type="copy" /></div></li>
                    <li><div className="context-menu-item" ><Icon type="eye" /></div></li>
                    <li><div className="context-menu-item" ><Icon type="link" /></div></li>
                  </ul>
              </Affix>
            </Sider>
            <Content style={{width: 'auto', margin: '0 80px'}}>
            <Editor style={{height: '100%'}}/>

            </Content>
            <Sider 
            width={200} 
            style={{ background: '#ececec' }}
            collapsed='true'
            >
                <Affix style={{ position: 'fixed', top: 100, right: 13}}>
                  <ul className="context-menu">
                    <li><div className="context-menu-item" ><Icon type="clock-circle-o" /></div></li>
                    <li><div className="context-menu-item" ><Icon type="lock" /></div></li>
                  </ul>
                </Affix>
            </Sider>
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