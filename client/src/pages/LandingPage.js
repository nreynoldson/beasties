import {Button, Spinner} from 'react-bootstrap';

import './css/Common.css';
import './css/LandingPage.css';

const LandingPage = (props) => {
  if(props.loading){
    return(
      <Spinner size="large" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
    </Spinner>
    )
  } else {

  return (
    <div className="d-flex justify-content-around p-4">
      <div className="d-flex flex-column justify-content-center align-items-start text-left">

        <h1 className="display-1 titleText"><b>Matchmaking For Pets</b></h1>

        <h4 className="mb-4">
          Create your profile, match with animals, set up "dates" and find your forever friend!
        </h4>

        <div className="d-flex flex-row align-items-center">
          <Button className="mr-3" variant="warning">Get Started</Button>
          <a className="pinkLink" href="/about">How it works {'>'}</a>
        </div>

      </div>

      <img
        className="w-75"
        src="/images/landing_image.jpg"
        alt="People playing with pets"
      />
    </div>
  );
  }
}
 
export default LandingPage;