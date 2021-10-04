import { Component } from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import Router from './Router';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    )
  }
}

export default App;
