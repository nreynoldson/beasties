import './css/Common.css';
import './css/Dashboard.css';
import {ListGroup, Col, Container, Spinner, Tab} from 'react-bootstrap'; 
import NotificationCenter from './NotificationCenter';
import ManagePets from '../components/account/ManagePets';
import EditAccount from '../components/account/EditAccount'
import AdminLandingPage from './AdminLandingPage';

const Dashboard = (props) => {
    return (
      <div className="dashboard">
        <h1 className="titleText small">HI, {props.auth.currentUser.userName}</h1>
        <Container className='dashboard-container'>
          <Col sm={1}/>
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="#requests">
            <Col sm={3} className="menu">
              <ListGroup>
                <ListGroup.Item action href="#requests">
                  Requests
                </ListGroup.Item>
                <ListGroup.Item action href="#account-settings">
                  Account Settings
                </ListGroup.Item>
                {props.auth.currentUser.isShelterOwner ?
                  <ListGroup.Item action href="#manage-pets">
                    Manage Animals
                  </ListGroup.Item> : '' }
                {props.auth.isAdmin ? 
                <ListGroup.Item action href="#admin">
                  Admin
                </ListGroup.Item> : '' }
              </ListGroup>
            </Col>
            <Col sm={7} className="view-content">
              <Tab.Content>
                <Tab.Pane eventKey="#requests">
                  <NotificationCenter auth={props.auth}/>
                </Tab.Pane>
                <Tab.Pane eventKey="#account-settings">
                  <EditAccount auth={props.auth}></EditAccount>
                </Tab.Pane>
                {props.auth.currentUser.isShelterOwner ?
                  <Tab.Pane eventKey="#manage-pets">
                    <ManagePets auth={props.auth}></ManagePets>
                  </Tab.Pane> : ''}
                {props.auth.isAdmin ? 
                  <Tab.Pane eventKey="#admin">
                    <AdminLandingPage auth={props.auth} />
                  </Tab.Pane> : ''
                }
              </Tab.Content>
            </Col>
        </Tab.Container>
        <Col sm={1}/>
      </Container>
      </div>

    );
  }

 
export default Dashboard;