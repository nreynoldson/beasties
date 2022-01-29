import { useCallback, useEffect, useMemo, useState } from 'react';

import { XCircleFill } from 'react-bootstrap-icons';

import Image from 'react-bootstrap/Image';

import './css/ImageManagement.css';


const ImageManagement = (props) => {

  // type can be 'animal', 'shelter', or 'user'
  const {
    allowEdit,
    avatarImageId,
    type
  } = props;

  const getOriginalImagesToDelete = useMemo(() => ({ displayName: null, id: null, url: null }), []);

  const [images, setImages] = useState([]);
  const [imageToDelete, setImageToDelete] = useState(getOriginalImagesToDelete);

  const afterGetImages = useCallback((response) => {

    if (response?.err) {
      // Handle error
      return;
    }

    else {
      setImages([
        {
          id: 1,
          displayName: 'Fido.jpg',
          url: '/images/no_image.svg'
        },
        {
          id: 2,
          displayName: 'Fido.jpg',
          url: '/images/no_image.svg'
        },
        {
          id: 3,
          displayName: 'Fido.jpg',
          url: '/images/no_image.svg'
        },
        {
          id: 4,
          displayName: 'Fido.jpg',
          url: '/images/no_image.svg'
        }
      ]);
    }

  }, []);

  const getImages = useCallback(() => {

    // TODO: make this actually fetch images when the back end api is ready
    afterGetImages();
  }, [afterGetImages]);

  useEffect(() => {

    // Fetch the images whenever the component loads
    getImages();
  }, [getImages]);

  const handleDeleteImageClick = useCallback((evt) => {

    if (!allowEdit) {
      return;
    }

    const { id, displayName, url } = evt.currentTarget.dataset;

    setImageToDelete({ id, displayName, url });
  }, []);

  const handleImageClick = useCallback((evt) => {

    if (!allowEdit) {
      return;
    }

    const { id } = evt.currentTarget.dataset;

    // TODO: Set avatar image
  }, []);

  const imageList = useMemo(() => {

    return images.map(({ id, displayName, url }) => {

      let imageClass = 'imageWrapper';
      let deleteButton = null;
      let imageOnClick = undefined;
      let title = displayName;

      if (allowEdit) {
        if (id === avatarImageId){
          imageClass += ' avatar';
          title = 'Current avatar';
        }
        else {
          imageClass += ' clickable';
          title = 'Click to set as avatar';
        }

        deleteButton = (
          <XCircleFill
            className="deleteButton"
            color="darkRed"
            size={25}
            data-id={id}
            data-display-name={displayName}
            data-url={url}
            onClick={handleDeleteImageClick}
          />
        );

        imageOnClick = handleImageClick;
      }

      return (
        <div key={id} title={title} className={imageClass}>
          <Image
            rounded
            src={url}
            height="250"
            data-id={id}
            imageOnClick={imageOnClick}
          />
          {deleteButton}
        </div>
      );
    });
  }, [allowEdit, avatarImageId, handleDeleteImageClick, images]);


  const componentOutput = useMemo(() => {

    return (
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {imageList}
      </div>
    );
  }, [imageList]);

  return componentOutput;
}

export default ImageManagement;
