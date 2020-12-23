import {
    useRouteMatch,
    Route,
    Switch,
    Redirect,

} from "react-router-dom";

import './main.scss'

import './watch/watch'
import { Watch } from "./watch/watch";

const mainroutes = [
    {
        id: "watch-wrapper",
        path: '/watch',
        page: <Watch ></Watch>

    },
    {
        id: "notification-wrapper",
        path: '/notifications',
        page: <div>123</div>
    },
    {
        id: "friends-wrapper",
        path: '/friends',
        page: <div>123</div>
    },
    {
        id: "settings-wrapper",
        path: '/settings',
        page: <div>123</div>
    },
];

function Main() {
    const defaultPage = '/watch'
    let { path, url } = useRouteMatch();
    //let url = '/ppoppi'
    //console.log(path, url)
    return (

        <div id='main-inner'>
            <Switch>

                {mainroutes.map((item, index) => (

                    <Route key={index} path={url + item.path}>
                        <div id={item.id}>{item.page}</div>

                    </Route>
                ))}
                <Route exact path={url}>
                    <Redirect to={path + defaultPage} />
                </Route>

            </Switch>
        </div >
    )
}

export { Main }