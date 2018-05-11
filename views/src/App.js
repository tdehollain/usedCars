import React, { Component } from 'react';
import './App.css';
import MyNavBar from './components/MyNavBar';
import { Route, Switch } from 'react-router-dom';
import HomeView from './components/HomeView';
import AdminView from './components/AdminView';
import EvolutionView from './components/EvolutionView';

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

class App extends Component {
  render() {

		// console.log('Rendering App');
    return (
      <div className="App pt-dark">
        <MyNavBar />
        <Switch>
          <Route exact path='/' component={HomeView} />
          <Route path='/evolution/' component={EvolutionView} />
          <Route path='/admin/' component={AdminView} />
        </Switch>
      </div>
    );
  }
}

export default App;
