import {
    useRouteMatch,
    Route,
    Switch,
    Redirect,
    useParams,
} from "react-router-dom";

import './main.scss'

import './watch/watch'
import { Watch } from "./watch/watch";

const mainroutes = [
    {
        id: "watch",
        path: '/watch',
        page: <Watch></Watch>

    },
    {
        id: "notification",
        path: '/notifications',
        page: <div>123</div>
    },
    {
        id: "friends",
        path: '/friends',
        page: <div>123</div>
    },
    {
        id: "settings",
        path: '/settings',
        page: <div>123</div>
    },
];

function Main() {

    let { path, url } = useRouteMatch();
    //let url = '/ppoppi'
    return (

        <div id='main-inner'>
            <Switch>

                {mainroutes.map((item, index) => (

                    <Route key={index} path={url + item.path}>
                        <div id={item.id}>{item.page}</div>

                    </Route>
                ))}
            </Switch>
        </div >
    )
}

export { Main }