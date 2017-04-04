import React from 'react';
import Styles from '../styles';

const Login = () => (
    <form className="navbar-form navbar-right">
        <div className="form-group">
            <input type="text" className="form-control" placeholder="email" style={Styles.marginRight}/>
            <input type="password" className="form-control" placeholder="password" style={Styles.marginRight}/>
        </div>
        <button type="submit" className="btn btn-default">Login</button>
    </form>
    );

export default Login;
