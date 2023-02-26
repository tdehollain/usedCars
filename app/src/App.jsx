import React from 'react';
import './App.css';
import MyNavBar from './Components/MyNavBar';
import MainContainer from './Components/MainContainer';

const App = () => (
  <div className="App pt-dark">
    <MyNavBar />
    <MainContainer />
    <footer>
      {`Build: ${process.env.REACT_APP_BUILD_NUMBER || 'local'}`}
    </footer>
  </div>
);

export default App;
