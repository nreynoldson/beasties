import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import AnimalConsts from '../../consts/Animal';

import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';

import { Check } from 'react-bootstrap-icons';

import './css/PetSearchResult.css';

const PetSearchResult = (props) => {

  const {
    age,
    availability,
    avatarUrl,
    breed,
    gender,
    goodWithOtherAnimals,
    goodWithChildren,
    id,
    images,
    name,
    mustBeLeashed,
    type
  } = props;

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
        </Link>
      </OverlayTrigger>
    );
  }, [age, avatarUrl, breedDisplay, id, name, popover]);

  return componentOutput;
}

export default PetSearchResult;