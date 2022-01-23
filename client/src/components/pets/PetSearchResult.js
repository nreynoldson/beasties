import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import PetConsts from '../../consts/Pets';

import Image from 'react-bootstrap/Image';

import './css/PetSearchResult.css';

const PetSearchResult = (props) => {

  const {
    id,
    name,
    age,
    type,
    breed,
    imageUrl
  } = props;

  const componentOutput = useMemo(() => {

    
    let breedDisplay = PetConsts.typeToDisplayNameMap[type];
    if (type === 'dog' || type === 'cat') {
      const breedToDisplayNameMap = (type === 'dog') ?
        PetConsts.dogBreedsToDisplayNameMap :
        PetConsts.catBreedsToDisplayNameMap;

      breedDisplay = `${breedDisplay} (${breedToDisplayNameMap[breed]})`;
    }

    return (
      <Link className="d-flex flex-column petSearchResult" to={`/pets/${id}/`}>
        <Image rounded src={imageUrl || '/images/no_image.svg'} height="250" />
        <div className="flex-column align-items-center justify-content-between">
          <h3 className="petName">{name}</h3>
          <span>
            {PetConsts.ageToDisplayNameMap[age]} <b className="mr-1 ml-1">•</b> {breedDisplay}
          </span>
        </div>
      </Link>
    );
  }, [age, breed, id, imageUrl, name, type]);

  return componentOutput;
}

export default PetSearchResult;