import React, { Component } from 'react';
import { Col, Row, Container} from 'react-bootstrap';
import { getUser } from '../components/Account';
import Notification from '../components/Notification';
import './css/Notification.css'

const testData = [
    {
        avatar: 'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg',
        user: 'happyuser01',
        name: 'Bruce',
        shelter: 'Pet Rescue',
        status: 'pending',
        type: 'adoption'
    },
    {
        avatar: 'https://jaxhumane.org/wp-content/uploads/2021/09/Biggie-Smalls-2019-scaled-e1633539814147.jpg',
        user: 'bobbyt86',
        name: 'Clyde',
        shelter: 'Happy Paws',
        status: 'fulfilled',
        type: 'date'
    },
    {
        avatar: 'https://jaxhumane.org/wp-content/uploads/2021/09/Biggie-Smalls-2019-scaled-e1633539814147.jpg',
        user: 'johnr09',
        name: 'Delilah',
        shelter: 'Happy Paws',
        status: 'accepted',
        type: 'date'
    },
]

export default class NotificationCenter extends Component {
    constructor(props){
        super(props);
        this.state = {
            isShelter: true,
            requests: []
        }
    }

    async componentDidMount(){
        //If the account is a shelter account, set isShelter
        var user = await getUser();

        //Grab all notifications that involve the given user
        this.setState({requests: testData});

    }
    render() {
        var requests = [];
        this.state.requests.forEach((req) => {
    
            requests.push(
                <Notification  isShelter = {this.state.isShelter} req = {req}/>
          )});
        return (
            <Container>
                {requests}
            </Container>
        );
    }
}

