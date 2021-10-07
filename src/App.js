import React, { createContext, useReducer } from 'react';
import { Route, Switch } from 'react-router-dom';
import { reducer } from './store'
import Navigation from './components/nav/Navigation.js';
import Home from './components/Home.js';
import './App.css';

export const CreaturesContext = createContext(null)

function App() {
  const initialState = { creatures: [] }
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <React.Fragment>
      <CreaturesContext.Provider value={{ state, dispatch }}>
        <Navigation />
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </CreaturesContext.Provider>
    </React.Fragment>
  )
}

export default App;
