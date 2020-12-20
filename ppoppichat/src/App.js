import './App.scss';
import React from 'react';

import { Login } from './home/login';
//import { Login } from './home/login';
//import { Login } from './home/login';
//import { Login } from './home/login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


const routes = [
  {
    id: "home",
    text: 'home',
    path: '',
    main: () => <div>123</div>
  },
  {
    id: "download",
    text: 'download',
    main: () => <div>download</div>
  },
  {
    id: "contact",
    text: 'contact us',
    main: () => <div>contact uwu</div>
  },
  {
    id: "story",
    text: 'our story',
    main: () => <div>our story</div>
  },
  {
    id: "login",
    text: 'login/ sign up',
    main: () => <Login />
  },
];


function App() {



  return (
    <Router>
      <div id='app'>
        <div id='home-navbar'>

          {routes.map((route, index) => (
            <Link
              key={index}
              id={route.id}
              className='navbar-button'
              to={'/' + (route.path ? route.path : route.id)}
            >
              <div className='navbar-button-inner'>
                {route.text}
              </div>
            </Link>
          ))}


        </div>

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          {routes.map((route, index) => (
            <Route key={index} exact path={'/' + route.id}>
              {route.main}
            </Route>

          ))}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
