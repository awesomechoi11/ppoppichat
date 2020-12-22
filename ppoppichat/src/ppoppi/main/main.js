import {
    useRouteMatch,
    Route,
    Switch,
    Redirect,
    useParams,
} from "react-router-dom";

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
        id: "settings",
        path: '/settings',
    },
    {
        id: "friends",
        path: '/friends',
    }
];

function Main() {

    let { path, url } = useRouteMatch();
    //let url = '/ppoppi'
    return (

        <div id='main-inner'>
            <Switch>

                {mainroutes.map((item, index) => (

                    <Route key={index} path={url + item.path}>
                        <div>{item.id}</div>

                    </Route>
                ))}
            </Switch>
        </div >
    )
}

export { Main }