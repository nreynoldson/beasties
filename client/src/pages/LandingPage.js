import {Button, Spinner} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { usePromiseTracker } from 'react-promise-tracker';

import './css/Common.css';
import './css/LandingPage.css';

const LandingPage = (props) => {
    const {
      auth
    } = props;

    let getStartedUrl;
    if (auth.isAdmin) {
      getStartedUrl = '/admin';
    }
    else if (auth.isShelterOwner) {
      getStartedUrl = '/notifications';
    }
    else {
      getStartedUrl = '/browse-pets';
    }

    return (
      <Container fluid className="p-4 landingContainer">
        <Row>
          <Col md="4" className="d-flex align-items-center">
            <div className="text-left">
              <h1 className="display-1 titleText"><b>Matchmaking For Pets</b></h1>
              <h4 className="mb-4">
                Create your profile, match with animals, set up "dates" and find your forever friend!
              </h4>
              <div className="d-flex flex-row align-items-center">
                <Button className="mr-3" variant="get-started" href={getStartedUrl}>
                  Get Started
                </Button>
                <a className="pinkLink" href="/about">How it works {'>'}</a>
              </div>
            </div>
          </Col>
          <Col md="8">
            <img
              className="w-75"
              src="/images/landing_image.jpg"
              alt="People playing with pets"
            />
          </Col>
        </Row>
      </Container>
    );
}
 
export default LandingPage;