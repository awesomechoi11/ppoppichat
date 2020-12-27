
import React from 'react';

export class StatusMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.statusMessage };

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
        //console.log('status message called ', this.state.value, this.props.statusMessage)
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text"
                    value={this.state.value ? this.state.value : this.props.statusMessage}
                    onChange={this.handleChange}
                />
            </form>
        );
    }
}

