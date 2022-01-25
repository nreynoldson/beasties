import React, { Component } from 'react';
import { AccountContext } from '../components/Account';

export default class Home extends Component {
    static contextType = AccountContext;

    componentDidMount(){
        console.log('in componenet did mount')

    }
    render() {

        const {authed, getSession,isAuthenticated} = this.context
        return (
            <div className="home">
                <h1>Project Home</h1>
            </div>
        );
    }
}