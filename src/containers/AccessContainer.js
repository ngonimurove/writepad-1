import Login from '../components/Login';
import Signup from '../components/Signup';

const isRegistered = true;

const AccessContainer = isRegistered ? Login : Signup;

export default AccessContainer;