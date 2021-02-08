import {
    useRouteMatch,
    Link
} from "react-router-dom";
import '../../../sass/panel.scss';



//import side bar panel button icons
const watchsvg = (
    <svg width="28" height="28">
        <path d="M2.8 1.8667C1.2536 1.8667 0 3.1203 0 4.6667V19.6C0 21.1464 1.2536 22.4 2.8 22.4L25.2 22.4C26.7464 22.4 28 21.1464 28 19.6V4.6667C28 3.1203 26.7464 1.8667 25.2 1.8667H2.8Z" />
        <path d="M7.46667 28H20.5333V26.1334H7.46667V28Z" />
    </svg>
)
const notificationsvg = (
    <svg width="28" height="28">
        <path d="M25.4,19.1c-0.9-1.1-0.1-4.5,0.5-6.2l0.2-0.6c0.8-2.2,0.7-3.8,0.1-5.6c-1-2.8-3.4-5.1-6.2-6.1l-0.1,0
	c-2.8-0.9-6-0.6-8.5,0.9C9.7,2.5,8.6,3.8,7.8,6.1L7.6,6.7C7,8.4,5.3,11,4.1,11.9c-1.2,0.9-2.6,0.8-3,2c-0.4,1.2,0,2.3,1.3,3.5
	c1.3,1.2,2.3,1.8,3.8,2.4c2.1,1,4.2,1.8,6.3,2.5c2.2,0.7,4.4,1.3,6.6,1.8c1.5,0.4,3.1,0.7,4.5,0.4c1.4-0.3,3-0.7,3.4-1.9
	C27.4,21.5,26.3,20.1,25.4,19.1z"/>
        <path d="M14.7,24.9C14,24.5,9.9,23.1,9.2,23c-0.6-0.1-1.4,0-1.6,0.7c-0.2,0.7,0,1.4,0.4,1.9l0,0c0.5,0.8,1.2,1.4,2,1.8
	c0.4,0.2,0.9,0.4,1.4,0.5c0.9,0.2,1.8,0.1,2.7-0.2l0,0c0.7-0.2,1.2-0.6,1.5-1.3C15.7,25.7,15.2,25.2,14.7,24.9"/>
    </svg>
)

const friendsvg = (
    <svg width="28" height="28">
        <path d="M10.2667 0C6.65871 0 3.73333 2.92259 3.73333 6.52968C3.73333 10.1368 6.65871 13.0594 10.2667 13.0594C13.8746 13.0594 16.8 10.1368 16.8 6.52968C16.8 2.92259 13.8746 0 10.2667 0Z" />
        <path d="M6.53333 16.7891C2.92528 16.7891 0 19.713 0 23.3214V27.983H20.5333V23.3214C20.5333 19.713 17.6081 16.7891 14 16.7891H6.53333Z" />
        <path d="M23.3333 18.6667H22.4V28H28V23.3333C28 20.756 25.9107 18.6667 23.3333 18.6667Z" />
        <path d="M21.4667 7.46667C18.8893 7.46667 16.8 9.55601 16.8 12.1333C16.8 14.7107 18.8893 16.8 21.4667 16.8C24.044 16.8 26.1333 14.7107 26.1333 12.1333C26.1333 9.55601 24.044 7.46667 21.4667 7.46667Z" />
    </svg>
)





function Panel(props) {

    let { url } = useRouteMatch();
    var panelconfig = [
        {
            id: "watch",
            svg: watchsvg,
            path: '/watch/' + props.videoroomID,

        },
        {
            id: "notification",
            svg: notificationsvg,
            path: '/notifications',
        },

        {
            id: "friends",
            svg: friendsvg,
            path: '/friends',
        }
    ];

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
                        {item.svg}
                    </div>
                </Link>
            ))}
        </div>
    )
}

export { Panel }