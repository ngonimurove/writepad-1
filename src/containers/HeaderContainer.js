import React from 'react';
import Title from '../components/Title';
import Login from '../components/Login';

const HeaderContainer = () => (
    <nav className="navbar navbar-default">
        <div className="container-fluid">
            <Title />
            <Login />
        </div>
    </nav>
    );

export default HeaderContainer;