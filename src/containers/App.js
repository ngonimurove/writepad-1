import React from 'react';
import HeaderContainer from '../containers/HeaderContainer';
import NotebookContainer from '../containers/NotebookContainer';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';

const { pathToJS } = helpers;

import '../App.css';

@firebase()
@connect(
  (state) => ({
   contentView: state.contentView,
   auth: pathToJS(state.firebase, 'auth')
  })
)
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  render () {
    
    const LoggedOutContentView = ( view ) => {
      
      switch ( view.active) {
        case 'CONTENT_LOGIN':
          return ( <Login /> );
        case 'CONTENT_SIGNUP':
          return ( <Signup /> );
        default:
          return ( <Login /> )
      }
    };

    const LoggedInContentView = ( view ) => {
      
      switch ( view.active) {
        case 'CONTENT_NOTEBOOK':
          return ( <NotebookContainer /> );
        default:
          return ( <NotebookContainer /> )
      }
    };

    return (
      <Layout style={{
        height: '100%',
        margin: '0 auto'}}>
        <HeaderContainer />
        { this.state.isLoggedIn ? LoggedInContentView(this.props.contentView) : LoggedOutContentView(this.props.contentView) }
      </Layout>
    )
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps !== this.props) {
      if (this.props.auth) {
            this.setState({isLoggedIn: true})
      } else {
        this.setState({isLoggedIn: false})
      }
    }

  }
};

export default App;
