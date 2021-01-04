import './App.scss';
import React from 'react';

import { Login } from './home/login';
import { Ppoppi } from './ppoppi/ppoppi';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Link,
  useLocation
} from "react-router-dom";

import { FirebaseContext, fire } from './firebasecontext'

import paper, { Point, Path } from 'paper/dist/paper-core';
import anime from 'animejs/lib/anime.es.js';
import { AnimatePresence, motion } from "framer-motion"




//obj for the home navbar
const routes = [
  {
    id: "home",
    text: (
      <div>

        <svg width="46" height="28" viewBox="0 0 46 28" style={{ marginRight: '15px' }} >
          <path d="M32.2641 17.8422C32.2641 12.6801 26.836 12.6801 22.685 12.6801C18.5341 12.6801 12.6802 12.6801 12.6802 17.8422C12.6802 23.0043 18.268 27.4213 22.685 27.4213C27.1021 27.4213 32.2641 23.0043 32.2641 17.8422Z" fill="black" stroke="black" />
          <ellipse cx="6.59895" cy="6.38608" rx="6.59895" ry="6.38608" fill="black" />
          <ellipse cx="38.7968" cy="6.38608" rx="6.59895" ry="6.38608" fill="black" />
        </svg>

          PPoPPi

      </div>
    ),
    path: '/',
    main: <Placeholder id='home' />
  },
  {
    id: "download",
    text: 'download',
    main: <Placeholder />
  },
  {
    id: "contact",
    text: 'contact us',
    main: <Placeholder />
  },
  {
    id: "story",
    text: 'our story',
    main: <Placeholder />
  },
  {
    id: "login",
    text: 'login/ sign up',
    main:
      <FirebaseContext.Provider value={fire}>
        <Login />
      </FirebaseContext.Provider>
  },
];



function CustomLink(props) {
  let history = useHistory();
  function handleClick() {
    history.push(props.to);
  }
  return (
    <div
      id={props.id}
      className='navbar-button'
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.location = window.location.pathname;
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    paperstuff(this.canvasRef.current)

  }




  render() {


    return (

      <Router>
        <div id='app'>


          <RouterWrapper />
        </div>
        <div id='app-background'>
          <canvas id="myCanvas"
            style={{ transform: 'translateY(20vw) rotate(-28deg)' }}
            ref={this.canvasRef} resize='true'></canvas>
        </div>
      </Router>

    )
  }
}

function RouterWrapper() {
  const location = useLocation();
  const pageVariants = {
    initial: {
      opacity: 0,
      x: '-100vw',
      scale: 0.8
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: '100vw',
      scale: 1.2
    }

  }

  const homenavbar =
    (
      <div id='home-navbar'>
        {routes.map((route, index) => (
          <CustomLink
            key={index}
            id={route.id}
            to={(route.path ? route.path : '/' + route.id)}
          >
            <div className='navbar-button-inner'>
              {route.text}
            </div>
          </CustomLink>
        ))}
      </div>
    )

  return (
    <AnimatePresence exitBeforeEnter>
      <Switch location={location} key={location.pathname}>

        {routes.map((route, index) => (

          <Route key={index} exact path={(route.path ? route.path : '/' + route.id)}>
            {homenavbar}
            <motion.div
              key={index}
              variants={pageVariants}
              initial='initial'
              animate='in'
              exit='out'

              className='app-page-wrapper'
            >
              {route.main}
            </motion.div>
          </Route>

        ))}
        <Route path='/ppoppi'>
          <Ppoppi />
        </Route>

      </Switch>
    </AnimatePresence>
  )
}


export default App;



function Placeholder(props) {
  var myObject = {
    value: 0.1,
  }
  anime.timeline({
    update: function () {
      window.paperstuff.speed = myObject.value
    }
  }).add({
    targets: '#myCanvas',
    translateY: '20vw',
    easing: 'cubicBezier(.45,0,.55,1.15)',
    'rotate': ['-28deg', '-28deg'],
    duration: 1500
  })


  return (
    <div

    >
      {props.id}
    </div>
  )

}

function paperstuff(canvasRef) {
  paper.setup(canvasRef)
  //var width, height, center;
  var points = 6;
  var path = new paper.Path();
  var mousePos = paper.view.center / 2;
  var pathHeight = mousePos.y;
  path.fillColor = '#DCE9FF';

  window.paperstuff = {}
  window.paperstuff.speed = 0.01;



  var center = paper.view.center;
  var width = paper.view.size.width;
  var height = paper.view.size.height / 2;
  function init() {
    path.segments = [];
    path.add(new Point(width / 2 - 1, paper.view.size.height));
    path.add(paper.view.bounds.bottomLeft);
    path.add(new Point(-200, paper.view.size.height / 4));

    for (var i = 0; i < points + 1; i++) {
      var point = new Point(width / points * i, center.y);
      path.add(point)
    }

    path.add(new Point(200 + width, paper.view.size.height / 4));
    path.add(paper.view.bounds.bottomRight);
    path.add(new Point(width / 2 + 1, paper.view.size.height));
  }
  init()
  //path.fullySelected = true;

  var count = 0;

  paper.view.onFrame = function (event) {
    if (event.count % 2 === 0) {
    }
    //your code here
    pathHeight += (center.y - mousePos.y - pathHeight) / 10;
    for (var i = 3; i < points + 4; i++) {
      var sinSeed = event.count + (i + i % 10) * 100;
      var yPos = 150 * Math.sin((sinSeed + count) / 150) + height / 8;
      path.segments[i].point.y = yPos;
      count += window.paperstuff.speed;
    }

    path.smooth({ type: 'continuous' });
  }

  paper.view.onMouseMove = function (event) {
    mousePos = event.point;
  }

  // Reposition the path whenever the window is resized:
  paper.view.onResize = function (event) {
    init()
  }
}
