import { Fragment, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { CircleFill } from 'react-bootstrap-icons';
import { XCircleFill } from 'react-bootstrap-icons';

import './css/UserSearchResult.css';

const UserSearchResult = (props) => {

  const {
    avatarUrl,
    canDelete,
    email,
    id,
    isShelterOwner,
    name,
    onDelete,
    shelterName
  } = props;

  const handleDeleteClick = useCallback((evt) => {

    evt.preventDefault();
    evt.stopPropagation();
    onDelete(id, name);
  }, [id, name, onDelete]);

  const componentOutput = useMemo(() => {

    const ownerInfo = (isShelterOwner) ?
      <div>Owner of "{shelterName}"</div> :
      null;

    let deleteButton = null;
    if (canDelete && onDelete) {
      deleteButton = (
        <Fragment>
          <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
            <XCircleFill
              className="deleteButton"
              color="darkRed"
              size={25}
              onClick={handleDeleteClick}
            />
          </OverlayTrigger>
          <CircleFill className="deleteButtonBackground" color="white" size={25} />
        </Fragment>
      );
    }

    return (
      <Link className="d-flex flex-column userSearchResult" to={`/user/${id}/`}>
        <Image onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src='/images/no_image.svg';
        }} rounded src={avatarUrl || '/images/no_image.svg'} height="250" />
        <div className="flex-column align-items-center justify-content-between">
          <h3 className="userName">{name}</h3>
          <a href={`mailto:${email}`}>{email}</a>
          {ownerInfo}
        </div>
        {deleteButton}
      </Link>
    );
  }, [
    avatarUrl,
    canDelete,
    email,
    handleDeleteClick,
    id,
    isShelterOwner,
    name,
    onDelete,
    shelterName
  ]);

  return componentOutput;
}

export default UserSearchResult;