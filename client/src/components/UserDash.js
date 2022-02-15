import {ListGroup, Col, Container, Tab} from 'react-bootstrap';
import NotificationCenter from '../pages/NotificationCenter';
import {useState, useEffect} from 'react';

const UserDash = (props) => {

  return (
      <Container className='dashboard-container'>
        <Col sm={1}/>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
          <Col sm={3}>
            <ListGroup>
              <ListGroup.Item action href="#link1">
                Your Requests
              </ListGroup.Item>
              <ListGroup.Item action href="#link2">
                Account Settings
              </ListGroup.Item>
              <ListGroup.Item action href="#link3">
                Edit Profile
              </ListGroup.Item>
              <ListGroup.Item action href="#link4">
                Admin
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col sm={7}>
            <Tab.Content>
              <Tab.Pane eventKey="#link1">
                <NotificationCenter/>
              </Tab.Pane>
              <Tab.Pane eventKey="#link2">
                
              </Tab.Pane>
            </Tab.Content>
          </Col>
      </Tab.Container>
      <Col sm={1}/>
    </Container>
  );
}
 
export default UserDash;