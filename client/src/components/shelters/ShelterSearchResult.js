import { Fragment, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { CircleFill } from 'react-bootstrap-icons';
import { XCircleFill } from 'react-bootstrap-icons';

import './css/ShelterSearchResult.css';

const ShelterSearchResult = (props) => {

  const {
    avatarUrl,
    canDelete,
    id,
    name,
    onDelete,
    // availableAnimals
  } = props;

  const handleDeleteClick = useCallback((evt) => {

    evt.preventDefault();
    evt.stopPropagation();
    onDelete(id, name);
  }, [id, name, onDelete]);

  const componentOutput = useMemo(() => {

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
      <Link className="d-flex flex-column shelterSearchResult" to={`/shelter/${id}/`}>
        <Image rounded src={avatarUrl || '/images/no_image.svg'} height="250" />
        <div className="flex-column align-items-center justify-content-between">
          <h3 className="shelterName">{name}</h3>
          {/* <span>{availableAnimals} pets available</span> */}
        </div>
        {deleteButton}
      </Link>
    );
  }, [
    // availableAnimals,
    avatarUrl,
    canDelete,
    handleDeleteClick,
    id,
    name,
    onDelete
  ]);

  return componentOutput;
}

export default ShelterSearchResult;