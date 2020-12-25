
import React from 'react';
import firebase from '../home/fire'

export class StatusMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.children };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        //update to firebase
        this.props.userRef.update({
            statusMessage: this.state.value
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text"
                    value={this.state.value ? this.state.value : this.props.children}
                    onChange={this.handleChange}
                />
            </form>
        );
    }
}

