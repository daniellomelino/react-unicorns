import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Navigation from './components/nav/Navigation.js';
import Home from './components/Home.js';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <Navigation />
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </React.Fragment>
  )
}

export default App;
