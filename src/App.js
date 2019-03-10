import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar';
import Roots from './components/Roots';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import { Provider } from 'react-redux'
import rootReducer from './redux/reducers'
import { createStore } from 'redux'


const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Router>
            <div>
              <AppNavbar></AppNavbar>
              <Roots></Roots>
            </div>
          </Router>
        </div>
      </Provider>
    );
  }
  componentDidMount() {
    document.title = "Datalyze";
  }


}

export default App;
