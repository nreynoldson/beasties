import './css/Common.css';
import './css/Dashboard.css';
import {ListGroup, Col, Container, Spinner, Tab} from 'react-bootstrap'; 
import NotificationCenter from './NotificationCenter';
import ManagePets from '../components/account/ManagePets';
import EditAccount from '../components/account/EditAccount'
import { usePromiseTracker } from 'react-promise-tracker';

const Dashboard = (props) => {
  const { promiseInProgress } = usePromiseTracker;

  if(promiseInProgress){
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <div>
        <h1 className="display-1 titleText"><b>HI, {props.auth.currentUser.userName}</b></h1>
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
                {props.auth.currentUser.isShelterOwner ?
                  <ListGroup.Item action href="#link3">
                    Manage Animals
                  </ListGroup.Item> : '' }
                <ListGroup.Item action href="#link4">
                  Admin
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm={7} className="view-content">
              <Tab.Content>
                <Tab.Pane eventKey="#link1">
                  <NotificationCenter auth={props.auth}/>
                </Tab.Pane>
                <Tab.Pane eventKey="#link2">
                  <EditAccount auth={props.auth}></EditAccount>
                </Tab.Pane>
                {props.auth.currentUser.isShelterOwner ?
                  <Tab.Pane eventKey="#link3">
                    <ManagePets auth={props.auth}></ManagePets>
                  </Tab.Pane> : ''}
                <Tab.Pane eventKey="#link4">
                </Tab.Pane>
              </Tab.Content>
            </Col>
        </Tab.Container>
        <Col sm={1}/>
      </Container>
      </div>

    );
  }
}
 
export default Dashboard;