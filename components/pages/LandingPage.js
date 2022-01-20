import './css/Common.css';
import './css/LandingPage.css';

const LandingPage = (props) => {

  return (
    <div className="root">
      <div className="flexColumn">
        <h2>Matchmaking For Pets</h2>
        <h5>
          Create your profile, match with animals, set up "dates" and find your forever friend!
        </h5>
        <div className="flexRow">
          <Button variant="warning">Get Started</Button>
          <a className="pinkLink" href="/about">How it works</a>
        </div>
      </div>
      <img src="/public/images/landing_image.jpg" alt="People playing with pets"/>
    </div>
  );
}
 
export default LandingPage;