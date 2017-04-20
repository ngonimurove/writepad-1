import React from 'react';
import Title from '../components/Title';
// import Login from '../components/Login';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { setContentView } from '../actions';

const { pathToJS } = helpers;
const { Header } = Layout;

const IconStyle = {
  width: '50px',
  height: '50px'
}
const IconStyleRight = {
  width: '50px',
  height: '50px',
  float: 'right'
}

@firebase()
@connect(
  (state) => ({
   contentView: state.contentView,
   auth: pathToJS(state.firebase, 'auth'),
  })
)
class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  render() {
    const {firebase} = this.props

    const handleLogout = (e) => {
      e.preventDefault();
      
      firebase.logout();
      
      this.setState({
        isLoggedIn: false
      });

      this.props.dispatch(setContentView('CONTENT_LOGIN'));
    }

    const navToProjects = (e) => {
      e.preventDefault();
      this.props.dispatch(setContentView('CONTENT_PROJECTS'));
    }

    const navToNotebook = (e) => {
      e.preventDefault();
      this.props.dispatch(setContentView('CONTENT_NOTEBOOK'));
    }

    const navToExport = (e) => {
      e.preventDefault();
      this.props.dispatch(setContentView('CONTENT_EXPORT'));
    }

    const navToSettings = (e) => {
      e.preventDefault();
      this.props.dispatch(setContentView('CONTENT_SETTINGS'));
    }

    return (
      <Header style={{ position: 'fixed', zIndex: '1', width: '100%', padding: '0', height: 'auto' }}>
        <Title />
        { this.state.isLoggedIn ? 
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}>
            <Menu.Item key="1" style={IconStyle}><a onClick={navToProjects}><Icon type="folder-open" /></a></Menu.Item>
            <Menu.Item key="2" style={IconStyle}><a onClick={navToNotebook}><Icon type="file-text"/></a></Menu.Item>
            <Menu.Item key="3" style={IconStyle}><a onClick={navToExport}><Icon type="export" /></a></Menu.Item>
            <Menu.Item key="4" style={IconStyleRight} ><a onClick={handleLogout}><Icon type="logout" /></a></Menu.Item>
            <Menu.Item key="5" style={IconStyleRight}><a onClick={navToSettings}><Icon type="setting" /></a></Menu.Item>
        </Menu>
        :
        <div></div> }
      </Header>
      )
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps !== this.props) {
      this.props.auth ? this.setState({isLoggedIn: true}) : this.setState({isLoggedIn: false})
    }
  }
};

export default HeaderContainer;