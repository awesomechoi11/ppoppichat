import ReactModal from 'react-modal';
//uses react modal but with custom settings
import React, { useState } from "react";
import './customModal.scss'
import axios from 'axios';

import { UserContext } from '../../../firebasecontext';

//const localurl = 'http://localhost:5001/ppoppi/us-central1/addVideoToList?'
const produrl = 'https://us-central1-ppoppi.cloudfunctions.net/addVideoToList?'
var currUrl = produrl

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '32px',
        background: '#A5B7D4',
        outline: 'none'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
};
ReactModal.setAppElement('#root')



export function SmallModal(props) {
    const [url, setUrl] = useState(" ");

    const handleInput = event => {
        setUrl(event.target.value);
    };
    //console.log(props.modalKey)
    const modalObj = {
        'members': <div>hello</div>,
        'queue': (
            <div className='add-video-modal'>
                <div className='add-video-modal-title'>add a video</div>
                <input onChange={handleInput} placeholder='hello' className='add-video-modal-input' />
                <UserContext.Consumer>
                    {value => (

                        <div
                            onClick={(e) => {
                                try {
                                    var uwu = new URL(url)
                                    console.log(props.userData.nickname, ' is adding ', url, ' to ', props.userData.videoroomID)
                                    axios({
                                        method: 'get',
                                        url: currUrl + 'url=' + url +
                                            '&username=' + value.nickname +
                                            '&videoroom=' + props.videoroomID,
                                        headers: {
                                            'Content-Type': null
                                        }
                                    }).then(res => {
                                        console.log(res.data)
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                } catch (e) { console.log(e) }
                            }}
                            className='add-video-modal-button'>add</div>
                    )}
                </UserContext.Consumer>
            </div>
        )
    }
    return (

        <ReactModal
            isOpen={props.modalIsOpen}
            style={customStyles}
            contentLabel="Example Modal"
            onRequestClose={props.closeModal}

        >
            {modalObj[props.modalKey]}
        </ReactModal>
    )
}