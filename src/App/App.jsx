import React, { useState, useEffect } from 'react';
// routing
import { BrowserRouter as Router, Route } from 'react-router-dom';
// components
import { HomePage } from '../HomePage';
import { Comparison } from '../Comparison';
import { Weight } from '../Weight';
import { Subscriptions } from '../Subscriptions';
import { Exchange } from '../Exchange';
import { Login } from '../LoginPage';
import { PrivateRoute } from './PrivateRoute';
import favicon from './fav.png';
function changeFavicon(src) {
  console.log('pass me?')
  var link = document.createElement('link'),
      oldLink = document.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.type = 'image/png/ico';
  link.href = src;
  if (oldLink) {
   document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}
export const App = () => {
  // returning application
  changeFavicon(favicon)
  return (
    <Router>
      <div>
        <PrivateRoute p="/" c={HomePage} />
        <PrivateRoute p="/comp" c={Comparison} />
        <PrivateRoute p="/weight" c={Weight} />
        <PrivateRoute p="/subscriptions" c={Subscriptions} />
        <PrivateRoute p="/exchange" c={Exchange} />
        <Route path="/login" component={Login} />
      </div>
    </Router>
  );
};