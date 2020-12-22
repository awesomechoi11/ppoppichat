import {
    useRouteMatch,
    Route,
    Switch,
    Redirect,
    useParams,
} from "react-router-dom";

import './main.scss'

const mainroutes = [
    {
        id: "watch",
        path: '/watch',

    },
    {
        id: "notification",
        path: '/notifications',
    },
    {
        id: "friends",
        path: '/friends',
    },
    {
        id: "settings",
        path: '/settings',
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
                        <div id={item.id}>{item.id}</div>

                    </Route>
                ))}
            </Switch>
        </div >
    )
}

export { Main }