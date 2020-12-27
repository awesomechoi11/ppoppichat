import ReactModal from 'react-modal';
//uses react modal but with custom settings
import React, { useState } from "react";
import './customModal.scss'
import axios from 'axios';




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

function AddVideoWindow(props) {

    const [url, setUrl] = useState(" ");

    const handleInput = event => {
        setUrl(event.target.value);
    };



    const modalObj = {
        'members': (<div>hello</div>),
        'queue': (
            <div className='add-video-modal'>
                <div className='add-video-modal-title'>add a video</div>
                <input onChange={handleInput} placeholder='hello' className='add-video-modal-input' />
                <div
                    onClick={(e) => {
                        console.log(props.userData.nickname, ' is adding ', url, ' to ', props.userData.videoroomID)
                        axios({
                            method: 'get',
                            url: 'https://us-central1-ppoppi.cloudfunctions.net/addVideoToList?' +
                                'url=' + url +
                                '&username=' + props.userData.nickname +
                                '&videoroom=' + props.userData.videoroomID,
                            headers: {
                                'Content-Type': null
                            }
                        }).then(res => {
                            console.log(res.data)
                        }).catch(err => {
                            console.log(err)
                        })

                    }}
                    className='add-video-modal-button'>add</div>
            </div>
        )
    }


    return modalObj[props.modalKey]



}

export function SmallModal(props) {
    const [url, setUrl] = useState(" ");

    const handleInput = event => {
        setUrl(event.target.value);
    };
    console.log(props.modalKey)
    const modalObj = {
        'members': <div>hello</div>,
        'queue': (
            <div className='add-video-modal'>
                <div className='add-video-modal-title'>add a video</div>
                <input onChange={handleInput} placeholder='hello' className='add-video-modal-input' />
                <div
                    onClick={(e) => {
                        console.log(props.userData.nickname, ' is adding ', url, ' to ', props.userData.videoroomID)
                        axios({
                            method: 'get',
                            url: 'https://us-central1-ppoppi.cloudfunctions.net/addVideoToList?' +
                                'url=' + url +
                                '&username=' + props.userData.nickname +
                                '&videoroom=' + props.userData.videoroomID,
                            headers: {
                                'Content-Type': null
                            }
                        }).then(res => {
                            console.log(res.data)
                        }).catch(err => {
                            console.log(err)
                        })

                    }}
                    className='add-video-modal-button'>add</div>
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