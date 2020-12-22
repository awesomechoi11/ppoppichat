import React from 'react';

import './ppoppi.scss';



import { Panel } from './sidebar/panel';
import { Main } from './main/main';


import {
    Switch,
    Route,

} from "react-router-dom";


//check if logged in,
//redirect to login page if not logged in

function SidebarButton() {

}


export class Ppoppi extends React.Component {




    render() {
        return (

            <div id='ppoppi-wrapper' className="" >
                <div id='sidebar'>
                    <div id='main-user-wrapper'>
                        <div id='user-status' className='status-online'></div>

                        <image
                            id='user-picture'
                        //src={this.props.i}
                        >

                        </image>

                        <div id='user-name'>
                            PPoPPstar132
                        </div>
                    </div>
                    <div id='channels-wrapper'>
                        <div id='channels-panel-wrapper'>
                            <Panel />
                        </div>
                        <hr className='divider'></hr>
                        <div id='channels'>
                            dsa
                        </div>
                    </div>
                </div>
                <div id='main-wrapper'>
                    <div id='topbar'>

                    </div>
                    <Main></Main>
                </div>
            </div>
        )
    }
}