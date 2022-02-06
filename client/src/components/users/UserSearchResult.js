import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import Image from 'react-bootstrap/Image';

import './css/UserSearchResult.css';

const UserSearchResult = (props) => {

  const {
    avatarUrl,
    email,
    id,
    isShelterOwner,
    name,
    shelterName
  } = props;

  const componentOutput = useMemo(() => {

    const ownerInfo = isShelterOwner ?
      <div>Owner of "{shelterName}"</div> :
      null;

    return (
      <Link className="d-flex flex-column shelterSearchResult" to={`/user/${id}/`}>
        <Image rounded src={avatarUrl || '/images/no_image.svg'} height="250" />
        <div className="flex-column align-items-center justify-content-between">
          <h3 className="shelterName">{name}</h3>
          <a href={`mailto:${email}`}>{email}</a>
          {ownerInfo}
        </div>
      </Link>
    );
  }, [ avatarUrl, email, id, isShelterOwner, name, shelterName]);

  return componentOutput;
}

export default UserSearchResult;