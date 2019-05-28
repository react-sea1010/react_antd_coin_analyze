import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// IDEA: create checkToken function, that will ensure that token is still alive and redirect to login page if not.

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={ props => ( localStorage.getItem('user') ? <Component {...props} /> : <Redirect to='/login' /> ) } />
);