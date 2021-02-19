import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    useRecoilState, useRecoilValue,
} from 'recoil';
import {
    userData_longterm,
    userData_status
} from '../utils/atoms'
import { firestore } from '../utils/firebasecontext';

export function StatusMessage() {

    const status = useRecoilValue(userData_status)
    const longterm = useRecoilValue(userData_longterm)

    const [statusByUser, setStatusByUser] = useState()

    const { register, handleSubmit } = useForm();
    const onSubmit = (data, e) => {
        //console.log(data.statusMessage, longterm.uid)
        firestore.doc('users/' + longterm.uid).update({
            statusMessage: data.statusMessage
        })
    };
    const onError = (errors, e) => console.log(errors, e);

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <input
                name='statusMessage'
                ref={register}
                type="text"
                placeholder='how are you??'
                defaultValue={status.statusMessage}
            />
        </form>
    );
}

export class OldStatusMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.statusMessage };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event, fire) {
        event.preventDefault();
        //update to firebase
        this.props.userRef.update({
            statusMessage: this.state.value
        })
    }

    render() {
        //console.log('status message called ', this.state.value, this.props.statusMessage)
        return (

            <form onSubmit={(e) => this.handleSubmit(e)}>


                <input
                    type="text"
                    placeholder='how are you??'
                    value={this.state.value ? this.state.value : this.props.statusMessage}
                    onChange={this.handleChange}
                />


            </form>



        );
    }
}

