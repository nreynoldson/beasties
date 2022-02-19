import React, { useState, useEffect } from 'react';
import {Container} from 'react-bootstrap';
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

export default function NotificationCenter(props) {
    const [isShelter, setShelter] = useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        //var user = await getUser();
        setRequests(testData)
    }, []);

    var requestEl = [];
    requests.forEach((req) => {
            requestEl.push(
                <Notification key={`${req.user}_${req.name}`} isShelter = {isShelter} req = {req}/>
        )
    });

    return (
        <Container className="notifications">
            {requestEl}
        </Container>
    );
}

