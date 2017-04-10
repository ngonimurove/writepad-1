import React from 'react';
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = ReactRouter.hashHistory;
var App = require('../containers/App');
var Signup = require('../components/Signup');
var NotebookContainer = require('../containers/NotebookContainer');

var routes = (
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={NotebookContainer} />
            <Route path='signup' header='Signup' component={Signup} />
        </Route>
    </Router>
);

module.exports = routes;