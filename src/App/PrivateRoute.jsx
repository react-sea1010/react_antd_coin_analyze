import React, { useState, useEffect } from 'react';
// routing
import { Route, Redirect } from 'react-router-dom';
// middleware
import { healthCheck } from '../_helpers';

const jwtDecode = require('jwt-decode');

export const PrivateRoute = (props) => {
  if(localStorage.getItem('user') && Number.parseInt(new Date().getTime() / 1000) - jwtDecode(JSON.parse(localStorage.getItem('user')).token).exp < 0) return (<Route exact path={props.p} component={props.c} />);
  return (<Redirect to="/login" />);
};