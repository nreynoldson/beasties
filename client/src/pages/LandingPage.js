import Button from 'react-bootstrap/Button';

import './css/Common.css';
import './css/LandingPage.css';

const LandingPage = (props) => {

  return (
    <div className="d-flex justify-content-around p-4">
      <div className="d-flex flex-column justify-content-center align-items-start">
        <h1 className="display-3"><b>Matchmaking For Pets</b></h1>
        <h4 className="text-left">
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
 
export default LandingPage;