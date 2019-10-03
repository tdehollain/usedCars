import React, { Component } from 'react';
import './App.css';
import MyNavBar from './components/MyNavBar';
import { Route, Switch } from 'react-router-dom';
import HomeView from './components/HomeView';
import AdminView from './AdminView/AdminView';
import EvolutionView from './components/EvolutionView';

class App extends Component {
  render() {
    // console.log('Rendering App');
    return (
      <div className="App pt-dark">
        <MyNavBar />
        <Switch>
          <Route exact path="/" component={HomeView} />
          <Route path="/evolution/" component={EvolutionView} />
          <Route path="/admin/" component={AdminView} />
        </Switch>
      </div>
    );
  }
}

export default App;
