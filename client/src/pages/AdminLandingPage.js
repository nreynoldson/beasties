import { Link } from 'react-router-dom';

import './css/Common.css';

const AdminLandingPage = (props) => {

  // TODO: redirect to 404 page for non-admins and add links to admin specific pages
  return (
    <div className="d-flex flex-column">
      <h1 className="display-3 mb-4">Admin Options</h1>
      <Link to="/browse-pets">Edit Pets</Link>
      <Link to="/browse-shelters">Edit Shelters</Link>
      <Link to="/browse-users">Edit Users</Link>
    </div>
  );
}
 
export default AdminLandingPage;