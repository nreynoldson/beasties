import React, { Component } from 'react';
import { getUser } from '../components/Account';

export default class Home extends Component {

    async componentDidMount(){
        var user = await getUser();
        console.log(user);

        if(!user){
            console.log('logged out')
        }

    }
    render() {
        return (
            <div className="home">
                <h1>Project Home</h1>
            </div>
        );
    }
}