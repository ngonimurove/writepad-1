import React from 'react';
import HeaderContainer from '../containers/HeaderContainer';
import NotebookContainer from '../containers/NotebookContainer';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Projects from '../components/Projects';
import Export from '../components/Export';
import Settings from '../components/Settings';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';

const { pathToJS } = helpers;

import '../App.css';

@firebase()
@connect(
  (state) => {
    return ({ contentView: state.contentView,
              userProfile: state.userProfile,
              auth: pathToJS(state.firebase, 'auth'),
              profile: pathToJS(state.firebase, 'profile'),
  })}
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
        case 'CONTENT_PROJECTS':
          return ( <Projects /> );
        case 'CONTENT_EXPORT':
          return ( <Export /> );
        case 'CONTENT_SETTINGS':
          return ( <Settings /> );
        default:
          return ( <Projects /> )
      }
    };

    return (
      <Layout style={{
        height: '100%',
        margin: '0 auto'}}>
        <HeaderContainer />
        <div style={{height: 'auto'}}>
        { this.state.isLoggedIn ? LoggedInContentView(this.props.contentView) : LoggedOutContentView(this.props.contentView) }
        </div>
      </Layout>
    )
  }

  componentDidUpdate(prevProps, prevState) {

    const { auth } = this.props;

    if (prevProps !== this.props) {
      if (auth) {
            this.setState({isLoggedIn: true});
      } else {
        this.setState({isLoggedIn: false})
      }
    }

  };
};

export default App;
