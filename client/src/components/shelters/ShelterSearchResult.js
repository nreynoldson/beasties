import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import Image from 'react-bootstrap/Image';

import './css/ShelterSearchResult.css';

const ShelterSearchResult = (props) => {

  const {
    avatarUrl,
    id,
    name,
    availableAnimals
  } = props;

  const componentOutput = useMemo(() => {

    return (
      <Link className="d-flex flex-column shelterSearchResult" to={`/shelter/${id}/`}>
        <Image rounded src={avatarUrl || '/images/no_image.svg'} height="250" />
        <div className="flex-column align-items-center justify-content-between">
          <h3 className="shelterName">{name}</h3>
          <span>{availableAnimals} pets available</span>
        </div>
      </Link>
    );
  }, [availableAnimals, avatarUrl, id, name]);

  return componentOutput;
}

export default ShelterSearchResult;