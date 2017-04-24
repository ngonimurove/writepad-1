import {createStore, combineReducers, compose} from 'redux'
import {reduxReactFirebase, firebaseStateReducer} from 'redux-react-firebase';
import contentView from '../reducers/contentView';
import userProfile from '../reducers/userProfile';
import activeProject from '../reducers/activeProject';

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  contentView: contentView,
  userProfile: userProfile,
  activeProject: activeProject
})
const config = {
  apiKey: 'AIzaSyDvFjjZ94Vxyigjyq6gn4CZmxWeU1qgApQ',
  authDomain: 'writepad-1.firebaseapp.com',
  databaseURL: 'https://writepad-1.firebaseio.com',
  storageBucket: 'writepad-1.appspot.com',
  userProfile: '/users'
}
const createStoreWithFirebase = compose(
    reduxReactFirebase(config),
)(createStore)


// export default createStoreWithFirebase(rootReducer, { firebase: { profile: { appState: 'active' } } });
export default createStoreWithFirebase(rootReducer);