import { useState, useEffect, useCallback, useMemo } from 'react';
import Nav from 'react-bootstrap/Nav';

import './css/Common.css';
import './css/PetModifyProfilePage.css';

const dogBreedsMap = [
  ['labrador', 'Labrador Retriever'],
  ['frenchBulldog', 'French Bulldog'],
  ['germanShepherdDog', 'German Shepherd Dog'],
  ['goldenRetriever', 'Golden Retriever'],
  ['bulldog', 'Bulldog'],
  ['poodle', 'Poodle'],
  ['beagle', 'Beagle'],
  ['rottweiler', 'Rottweiler'],
  ['germanShorthairedPointer', 'German Shorthaired Pointer'],
  ['dachshund', 'Dachshund'],
  ['pembrokeWelshCorgi', 'Pembroke Welsh Corgi'],
  ['australianShepherd', 'Australian Shepherd'],
  ['yorkshireTerrier', 'Yorkshire Terrier'],
  ['boxer', 'Boxer'],
  ['greatDane', 'Great Dane'],
  ['siberianHuskie', 'Siberian Huskie'],
  ['cavalierKingCharlesSpaniel', 'Cavalier King Charles Spaniel'],
  ['dobermanPinscher', 'Doberman Pinscher'],
  ['miniatureSchnauzer', 'Miniature Schnauzer'],
  ['shihTzu', 'Shih Tzu'],
  ['bostonTerrier', 'Boston Terrier'],
  ['berneseMountainDog', 'Bernese Mountain Dog'],
  ['pomeranian', 'Pomeranian'],
  ['havanese', 'Havanese'],
  ['caneCorso', 'Cane Corso'],
  ['englishSpringerSpaniel', 'English Springer Spaniel'],
  ['shetlandSheepdog', 'Shetland Sheepdog'],
  ['brittany', 'Brittany'],
  ['pug', 'Pug'],
  ['cockerSpaniel', 'Cocker Spaniel'],
  ['miniatureAmericanShepherd', 'Miniature American Shepherd'],
  ['borderCollie', 'Border Collie'],
  ['mastiff', 'Mastiff'],
  ['chihuahua', 'Chihuahua'],
  ['vizsla', 'Vizsla'],
  ['bassetHound', 'Basset Hound'],
  ['belgianMalinoi', 'Belgian Malinoi'],
  ['maltese', 'Maltese'],
  ['weimaraner', 'Weimaraner'],
  ['collie', 'Collie'],
  ['newfoundland', 'Newfoundland'],
  ['rhodesianRidgeback', 'Rhodesian Ridgeback'],
  ['shibaInu', 'Shiba Inu'],
  ['westHighlandWhiteTerrier', 'West Highland White Terrier'],
  ['bichonsFrise', 'Bichons Frise'],
  ['bloodhound', 'Bloodhound'],
  ['englishCockerSpaniels', 'English Cocker Spaniel'],
  ['akita', 'Akita'],
  ['portugueseWaterDog', 'Portuguese Water Dog'],
  ['chesapeakeBayRetriever', 'Chesapeake Bay Retriever'],
  ['dalmatian', 'Dalmatian'],
  ['stBernard', 'St. Bernard'],
  ['papillon', 'Papillon'],
  ['australianCattleDog', 'Australian Cattle Dog'],
  ['bullmastiff', 'Bullmastiff'],
  ['samoyed', 'Samoyed'],
  ['scottishTerrier', 'Scottish Terrier'],
  ['softCoatedWheatenTerrier', 'Soft Coated Wheaten Terrier'],
  ['whippet', 'Whippet'],
  ['germanWirehairedpointer', 'German Wirehaired Pointer'],
  ['chineseShar-Pei', 'Chinese Shar-Pei'],
  ['airedaleTerrier', 'Airedale Terrier'],
  ['wirehairedPointingGriffon', 'Wirehaired Pointing Griffon'],
  ['bullTerrier', 'Bull Terrier'],
  ['alaskanMalamute', 'Alaskan Malamute'],
  ['cardiganWelshCorgi', 'Cardigan Welsh Corgi'],
  ['giantSchnauzer', 'Giant Schnauzer'],
  ['oldEnglishSheepdog', 'Old English Sheepdog'],
  ['italianGreyhound', 'Italian Greyhound'],
  ['greatPyrenee', 'Great Pyrenee'],
  ['doguesdeBordeaux', 'Dogues de Bordeaux'],
  ['russellTerrier', 'Russell Terrier'],
  ['cairnTerrier', 'Cairn Terrier'],
  ['irishWolfhound', 'Irish Wolfhound'],
  ['irishsetter', 'Irish Setters'],
  ['greaterSwissMountainDog', 'Greater Swiss Mountain Dog'],
  ['miniaturePinscher', 'Miniature Pinscher'],
  ['lhasaApso', 'Lhasa Apso'],
  ['chineseCrested', 'Chinese Crested'],
  ['cotondeTulear', 'Coton de Tulear'],
  ['staffordshireBullTerrier', 'Staffordshire Bull Terrier'],
  ['americanStaffordshireTerrier', 'American Staffordshire Terrier'],
  ['ratTerrier', 'Rat Terrier'],
  ['chowChow', 'Chow Chow'],
  ['anatolianShepherdDog', 'Anatolian Shepherd Dog'],
  ['basenji', 'Basenji'],
  ['other', 'Other']
];

const catBreedsMap = [
  ['ragdoll', 'Ragdoll'],
  ['exoticShorthair', 'Exotic Shorthair'],
  ['maineCoon', 'Maine Coon'],
  ['persian', 'Persian'],
  ['britishShorthair', 'British Shorthair'],
  ['devonRex', 'Devon Rex'],
  ['abyssinian', 'Abyssinian'],
  ['americanShorthair', 'American Shorthair'],
  ['scottish', 'Scottish Fold'],
  ['sphynx', 'Sphynx'],
  ['oriental', 'Oriental'],
  ['siamese', 'Siamese'],
  ['cornishRex', 'Cornish Rex'],
  ['norwegianForestCat', 'Norwegian Forest Cat'],
  ['siberian', 'Siberian'],
  ['birman', 'Birman'],
  ['russianBlue', 'Russian Blue'],
  ['bengal', 'Bengal'],
  ['burmese', 'Burmese'],
  ['ocicat', 'Ocicat'],
  ['other', 'Other']
];

const BrowsePetsPage = (props) => {

  const {
    petId
  } = props;

  const getOriginalInputs = useMemo(() => {
  
    return {
      name: '',
      type: 'other',
      breed: 'other',
      goodWithOtherAnimals: false,
      goodWithChildren: false,
      mustBeLeashed: false,
      availability: 'available'
    };
  }, []);

  const [inputs, setInputs] = useState(getOriginalInputs);

  const breedSelect = useMemo(() => {
  
    if (inputs.type === 'other') {
      return null;
    }

    const breedNamesMap = (inputs.type === 'dog') ? dogBreedsMap : catBreedsMap;
    const options = breedNamesMap.map(([ breed, displayName ]) => {

      return <option value={breed} selected={inputs.breed === breed}>{displayName}</option>
    });
    
    return (
      <FloatingLabel controlId="floatingSelect" label="Breed">
        <Form.Select onChange={handleValueChange} name="breed">
          {options}
        </Form.Select>
      </FloatingLabel>
    );
  }, [inputs, handleValueChange]);

  const componentOutput = useMemo(() => {
  
    return (
      <div className="root">
        <FloatingLabel controlId="floatingSelect" label="Type">
          <Form.Select onChange={handleValueChange} name="type">
            <option value="dog" selected={inputs.type === 'dog'}>Dog</option>
            <option value="cat" selected={inputs.type === 'cat'}>Cat</option>
            <option value="other" selected={inputs.type === 'other'}>Other</option>
          </Form.Select>
        </FloatingLabel>
        {breedSelect}
      </div>
    );
  }, [breedSelect, handleValueChange, inputs]);

  return componentOutput;
}

export default BrowsePetsPage;