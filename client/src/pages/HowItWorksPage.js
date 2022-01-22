import './css/Common.css';

const HowItWorksPage = (props) => {

  return (
    <div className="flexColumn">
      <h2>How It Works</h2>
      <h5>For Hopeful Adopters</h5>
        <ul>
          <li>Sign up and give us some information about yourself</li>
          <li>Find a pet you like and request to take it on a "date" for a specified time period</li>
          <li>Wait for the shelter to confirm the request</li>
          <li>After the "date" if everything went well you may request to adopt the pet</li>
        </ul>

      <h5>For Animal Shelters</h5>
        <ul>
          <li>Sign up and give us some information about your shelter</li>
          <li>Create a dating profile for your animals</li>
          <li>Accept or reject requests to "date" an animal for a specified time period</li>
          <li>Accept or reject requests to adopt the animals</li>
        </ul>
    </div>
  );
}
 
export default HowItWorksPage;