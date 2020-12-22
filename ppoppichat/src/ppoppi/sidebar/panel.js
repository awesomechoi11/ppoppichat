import {
    useRouteMatch,
    Link,
    Route
} from "react-router-dom";
import './panel.scss';
//import side bar panel button icons
import watchsvg from './svg/watch.svg'
import notificationsvg from './svg/notification.svg'
import settingsvg from './svg/settings.svg'
import friendsvg from './svg/friends.svg'




const panelconfig = [
    {
        id: "watch",
        svg: watchsvg,
        path: '/watch',

    },
    {
        id: "notification",
        svg: notificationsvg,
        path: '/notifications',
    },
    {
        id: "settings",
        svg: settingsvg,
        path: '/settings',
    },
    {
        id: "friends",
        svg: friendsvg,
        path: '/friends',
    }
];

function Panel() {

    let { url } = useRouteMatch();


    return (

        <div id='panel-inner'>

            {panelconfig.map((item, index) => (
                <Link
                    key={index}
                    id={item.id}
                    className='panel-item'
                    to={url + item.path}
                >
                    <div className='panel-item-svg'>
                        <img src={item.svg}></img>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export { Panel }