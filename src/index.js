import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { Routes } from './Routes';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyAaz7pGlhd6hXvNg1s1ocWiHAe_vZcXzcg",
  authDomain: "word-game-17224.firebaseapp.com",
  databaseURL: "https://word-game-17224.firebaseio.com",
  projectId: "word-game-17224",
  storageBucket: "word-game-17224.appspot.com",
  messagingSenderId: "217843913120",
  appId: "1:217843913120:web:6651d79a97b217c6"
};

firebase.initializeApp(firebaseConfig);
// const history = createHistory();
ReactDOM.render(
  <HashRouter>
    <Routes />
  </HashRouter>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
