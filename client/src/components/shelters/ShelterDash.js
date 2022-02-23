import {ListGroup, Col, Container, Tab} from 'react-bootstrap';
import NotificationCenter from '../../pages/NotificationCenter';
import {useState, useEffect} from 'react';
import ManagePets from '../account/ManagePets';
import EditAccount from '../account/EditAccount';

const ShelterDash = (props) => {

  return (
      <Container className='dashboard-container'>
        <Col sm={1}/>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
          <Col sm={3} className="menu">
            <ListGroup>
              <ListGroup.Item action href="#link1">
                Requests
              </ListGroup.Item>
              <ListGroup.Item action href="#link2">
                Account Settings
              </ListGroup.Item>
              <ListGroup.Item action href="#link3">
                Manage Animals
              </ListGroup.Item>
              <ListGroup.Item action href="#link4">
                Admin
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col sm={7} className="view-content">
            <Tab.Content>
              <Tab.Pane eventKey="#link1">
                <NotificationCenter/>
              </Tab.Pane>
              <Tab.Pane eventKey="#link2">
                <EditAccount auth={props.auth}></EditAccount>
              </Tab.Pane>
                <Tab.Pane eventKey="#link3">
                  <ManagePets></ManagePets>
                </Tab.Pane>
                <Tab.Pane eventKey="#link4">
                
                </Tab.Pane>
            </Tab.Content>
          </Col>
      </Tab.Container>
      <Col sm={1}/>
    </Container>
  );
}
 
export default ShelterDash;