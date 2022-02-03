import React, { Component } from 'react';
import { Col, Row, Container} from 'react-bootstrap';
import { getUser } from '../components/Account';
import Notification from '../components/Notification';
import '../style/Notification.css'

const testData = [
    {
        avatar: 'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg',
        user: 'BobbyT',
        name: 'Bruce',
        shelter: 'Pet Rescue',
        status: 'pending',
        type: 'adoption'
    },
    {
        avatar: 'https://jaxhumane.org/wp-content/uploads/2021/09/Biggie-Smalls-2019-scaled-e1633539814147.jpg',
        user: 'BobbyT',
        name: 'Clyde',
        shelter: 'Happy Paws',
        status: 'fulfilled',
        type: 'date'
    },
    {
        avatar: 'https://jaxhumane.org/wp-content/uploads/2021/09/Biggie-Smalls-2019-scaled-e1633539814147.jpg',
        user: 'BobbyT',
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
            isShelter: false,
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
                <Notification req = {req}/>
          )});
        return (
            <Container>
                {requests}
            </Container>
        );
    }
}

