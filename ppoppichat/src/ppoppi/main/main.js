import {
    useRouteMatch,
    Route,
    Switch,
    Redirect,

} from "react-router-dom";

import './main.scss'
import { Placeholder } from "./placeholder";

import './watch/watch'
import { Watch } from "./watch/watch";

//import { UserContext } from '../firebasecontext'


const mainroutes = [
    {
        id: "watch-wrapper",
        path: '/watch/:videoRoom',
        page: (...props) => <Watch {...props} ></Watch>

    },
    {
        id: "notification-wrapper",
        path: '/notifications',
        page: (...props) => <Placeholder {...props}></Placeholder>
    },
    {
        id: "friends-wrapper",
        path: '/friends',
        page: (...props) => <Placeholder {...props}></Placeholder>
    },
    {
        id: "settings-wrapper",
        path: '/settings',
        page: (...props) => <Placeholder {...props}></Placeholder>
    },
];

function Main(props) {
    const defaultPage = '/watch'
    let { path, url } = useRouteMatch();
    //let url = '/ppoppi'
    //console.log(path, url)
    console.log('main called')
    return (

        <div id='main-inner'>
            {props.userData.loggedIn &&
                <Switch>

                    {mainroutes.map((item, index) => (

                        <Route key={index} path={url + item.path}>
                            <div id={item.id}>{item.page({
                                userData: props.userData,
                                key: item.id
                            })}</div>

                        </Route>
                    ))}
                    <Route exact path={url}>
                        <Redirect to={path + defaultPage} />
                    </Route>

                </Switch>
            }
        </div >
    )
}

export { Main }