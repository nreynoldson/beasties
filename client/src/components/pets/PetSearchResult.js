import { Fragment, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import AnimalConsts from '../../consts/Animal';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip'

import { Check } from 'react-bootstrap-icons';
import { CircleFill } from 'react-bootstrap-icons';
import { XCircleFill } from 'react-bootstrap-icons';

import './css/PetSearchResult.css';

const PetSearchResult = (props) => {

  const {
    age,
    availability,
    avatarUrl,
    breed,
    canDate,
    canDelete,
    dateInfo,
    gender,
    goodWithOtherAnimals,
    goodWithChildren,
    id,
    images,
    mustBeLeashed,
    name,
    onDelete,
    type
  } = props;

  const handleDeleteClick = useCallback((evt) => {

    evt.preventDefault();
    evt.stopPropagation();
    onDelete(id, name);
  }, [id, name, onDelete]);

  const breedDisplay = useMemo(() => {
  
    
    let breedDisplay = AnimalConsts.typeToDisplayNameMap[type];
    if (type === 'dog' || type === 'cat') {
      const breedToDisplayNameMap = (type === 'dog') ?
        AnimalConsts.dogBreedsToDisplayNameMap :
        AnimalConsts.catBreedsToDisplayNameMap;

      breedDisplay = `${breedDisplay} (${breedToDisplayNameMap[breed]})`;
    }

    return breedDisplay;
  }, [breed, type]);

  const popover = useMemo(() => {

    const imageElements = images.map(({ displayName, id, url }) => {

      return (
        <Image
          rounded
          className="m-2"
          key={id}
          src={url}
          title={displayName}
          height="100"
        />
      );
    });

    let goodWithOtherAnimalsRow = null;
    let goodWithChildrenRow = null;
    let mustBeLeashedRow = null;

    if (goodWithOtherAnimals) {
      goodWithOtherAnimalsRow = (
        <tr>
          <td><b>{AnimalConsts.dispositionToDisplayNameMap.goodWithOtherAnimals}</b></td>
          <td><Check size={25} color="green" /></td>
        </tr>
      );
    }

    if (goodWithChildren) {
      goodWithChildrenRow = (
        <tr>
          <td><b>{AnimalConsts.dispositionToDisplayNameMap.goodWithChildren}</b></td>
          <td><Check size={25} color="green" /></td>
        </tr>
      );
    }

    if (mustBeLeashed) {
      mustBeLeashedRow = (
        <tr>
          <td><b>{AnimalConsts.dispositionToDisplayNameMap.mustBeLeashed}</b></td>
          <td><Check size={25} color="red" /></td>
        </tr>
      );
    }

    return (
      <Popover id={`petProfileQuickView${id}`} className="petProfileQuickView">
        <Popover.Header as="h3" className="text-center">
          <b>{name}</b>
        </Popover.Header>
        <Popover.Body>
          <div className="d-flex flex-wrap flex-row mr-auto">
            {imageElements}
          </div>
          <Table className="petProfileQuickViewTable">
            <tbody>
              <tr>
                <td><b>Type</b></td>
                <td>{breedDisplay}</td>
              </tr>
              <tr>
                <td><b>Age</b></td>
                <td>{AnimalConsts.ageToDisplayNameMap[age]}</td>
              </tr>
              <tr>
                <td><b>Gender</b></td>
                <td>{AnimalConsts.genderToDisplayNameMap[gender]}</td>
              </tr>
              <tr>
                <td><b>Availability</b></td>
                <td>{AnimalConsts.availabilityToDisplayNameMap[availability]}</td>
              </tr>
              {goodWithOtherAnimalsRow}
              {goodWithChildrenRow}
              {mustBeLeashedRow}
            </tbody>
          </Table>
        </Popover.Body>
      </Popover>
    );
  }, [
    age,
    availability,
    breedDisplay,
    gender,
    goodWithOtherAnimals,
    goodWithChildren,
    id,
    images,
    name,
    mustBeLeashed
  ]);

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

    let dateButton = null;
    if (canDate && !dateInfo) {
      dateButton = (
        <Link to={`/pet/${id}/request-date`}>
          <Button className="mt-2" size="sm" variant="date-pet">
            Request Date
          </Button>
        </Link>
      );
    }

    let dateInfoElement = null;
    if (dateInfo) {
      const dateDisplayOptions = ['en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}];
      const startDate = new Date(dateInfo.startDate)
        .toLocaleDateString(...dateDisplayOptions);
      const endDate = new Date(dateInfo.endDate)
        .toLocaleDateString(...dateDisplayOptions);
      dateInfoElement = (
        <Link className="dateInfo mt-2" to={`/date/${id}/`}>
          Date scheduled:
          <br/>
          {startDate}{' - '}
          <br/>
          {endDate}
        </Link>
      );
    }

    return (
      <OverlayTrigger placement="auto" overlay={popover}>
        <Link className="d-flex flex-column petSearchResult" to={`/pet/${id}/`}>
          <Image rounded src={avatarUrl || '/images/no_image.svg'} height="250" />
          <div className="flex-column align-items-center justify-content-between">
            <h3 className="petName">{name}</h3>
            <span>
              {AnimalConsts.ageToDisplayNameMap[age]} <b className="mr-1 ml-1">•</b> {breedDisplay}
            </span>
          </div>
          {deleteButton}
          {dateButton}
          {dateInfoElement}
        </Link>
      </OverlayTrigger>
    );
  }, [
    age,
    avatarUrl,
    breedDisplay,
    canDate,
    canDelete,
    dateInfo,
    handleDeleteClick,
    id,
    name,
    onDelete,
    popover
  ]);

  return componentOutput;
}

export default PetSearchResult;