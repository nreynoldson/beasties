import Button from 'react-bootstrap/Button';

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
    <div className="d-flex justify-content-around p-4">
      <div className="d-flex flex-column justify-content-center align-items-start text-left">

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

      <img
        className="w-75"
        src="/images/landing_image.jpg"
        alt="People playing with pets"
      />
    </div>
  );
}
 
export default LandingPage;