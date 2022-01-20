import './css/Common.css';

const ContactPage = (props) => {

  return (
    <div className="flexColumn">
      <h5>You may contact us at:</h5>
      <address>
        1234 Commerce St
        <br/>
        Ste 100
        <br/>
        Los Angeles, CA 90094
        <br/>
        <a href="mailto:hello@besties.com">hello@besties.com</a>
        <br/>
        <a href="tel:+1888888888">1 (888) 888-8888</a>
      </address>
    </div>
  );
}

export default ContactPage;