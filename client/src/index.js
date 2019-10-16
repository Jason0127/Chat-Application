import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import Routes from './routes';
import './styles/style.css';

function App(){
   return(
      <BrowserRouter>
         <Routes />
      </BrowserRouter>
   )
}

ReactDOM.render(<App/>, document.querySelector('#root'))