import './App.scss';
import React from 'react';

import { Login } from './home/login';
import { Ppoppi } from './ppoppi/ppoppi';
//import { Login } from './home/login';
//import { Login } from './home/login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

//obj for the home navbar
const routes = [
  {
    id: "home",
    text: 'PPoPPi',
    path: '/',
    main: <div>home page</div>
  },
  {
    id: "download",
    text: 'download',
    main: <div>download</div>,
  },
  {
    id: "contact",
    text: 'contact us',
    main: <div>contact uwu</div>
  },
  {
    id: "story",
    text: 'our story',
    main: <div>our story</div>
  },
  {
    id: "login",
    text: 'login/ sign up',
    main: <Login />
  },
];


function App() {

  const homenavbar =
    (
      <div id='home-navbar'>

        {routes.map((route, index) => (
          <Link
            key={index}
            id={route.id}
            className='navbar-button'
            to={(route.path ? route.path : '/' + route.id)}
          >
            <div className='navbar-button-inner'>
              {route.text}
            </div>
          </Link>
        ))}
      </div>
    )

  return (
    <Router>
      <div id='app'>
        <Switch>


          {routes.map((route, index) => (

            <Route key={index} exact path={(route.path ? route.path : '/' + route.id)}>
              <div>

                {homenavbar}
                {route.main}
              </div>
            </Route>

          ))}

          <Route path='/ppoppi'>
            <Ppoppi />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
