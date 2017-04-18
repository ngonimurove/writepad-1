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

    return (
      <Header style={{ position: 'fixed', width: '100%', padding: '0', height: 'auto' }}>
        <Title />
        { this.state.isLoggedIn ? 
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}>
            <Menu.Item key="1" style={IconStyle}><Icon type="folder-open" /></Menu.Item>
            <Menu.Item key="2" style={IconStyle}><Icon type="file-add" /></Menu.Item>
            <Menu.Item key="3" style={IconStyle}><Icon type="export" /></Menu.Item>
            <Menu.Item key="4" style={IconStyleRight} ><Icon type="logout" onClick={handleLogout}/></Menu.Item>
            <Menu.Item key="5" style={IconStyleRight}><Icon type="setting" /></Menu.Item>
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