import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { CircleFill } from 'react-bootstrap-icons';
import { XCircleFill } from 'react-bootstrap-icons';

import './css/ImageManagement.css';


const ImageManagement = (props) => {

  // type can be 'animal', 'shelter', or 'user'
  const {
    allowEdit,
    avatarImageId,
    type
  } = props;

  const [images, setImages] = useState([]);
  const [imageToDelete, setImageToDelete] = useState(null);

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
  }, [allowEdit]);

  const handleImageClick = useCallback((evt) => {

    if (!allowEdit) {
      return;
    }

    const { id } = evt.currentTarget.dataset;

    // TODO: Api call to set avatar image
  }, [allowEdit]);

  const handleUploadFile = useCallback((evt) => {

    // TODO: Upload image, refresh results, and clear upload input
  }, []);

  const handleFileInputChange = useCallback((evt) => {

    if (!evt.currentTarget.value) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(evt.currentTarget.files[0]);
    reader.onloadend = handleUploadFile
  }, [handleUploadFile]);

  const handleCloseDeleteImageModal = useCallback(() => setImageToDelete(null), [null]);

  const handleConfirmDeleteImage = useCallback(() => {

    // TODO: make api request to delete image and refresh images
    handleCloseDeleteImageModal();
  }, [handleCloseDeleteImageModal]);

  const confirmDeleteModal = useMemo(() => {

    if (!allowEdit) {
      return null;
    }

    return (
      <ConfirmDeleteModal
        body={
          <Fragment>
            <Image
              rounded
              src={imageToDelete?.url}
              title={imageToDelete?.displayName}
              height="150"
            />
            <h5 className="mt-3">Really delete this image?</h5>
          </Fragment>
        }
        onClose={handleCloseDeleteImageModal}
        onConfirm={handleConfirmDeleteImage}
        show={Boolean(imageToDelete)}
        title="Confirm Delete Image"
      />
    );
  }, [allowEdit, handleCloseDeleteImageModal, handleConfirmDeleteImage, imageToDelete]);

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
          <Fragment>
            <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
              <XCircleFill
                className="deleteButton"
                color="darkRed"
                size={25}
                data-id={id}
                data-display-name={displayName}
                data-url={url}
                onClick={handleDeleteImageClick}
              />
            </OverlayTrigger>
            <CircleFill className="deleteButtonBackground" color="white" size={25} />
          </Fragment>
        );

        imageOnClick = handleImageClick;
      }

      return (
        <div key={id} className={imageClass}>
          <Image
            rounded
            src={url}
            title={title}
            height="250"
            data-id={id}
            onClick={imageOnClick}
          />
          {deleteButton}
        </div>
      );
    });
  }, [allowEdit, avatarImageId, handleDeleteImageClick, handleImageClick, images]);

  const imageUploader = useMemo(() => {

    if (!allowEdit) {
      return null;
    }

    return (
      <div className="w-100 d-flex justify-content-center align-items-center">
        <h5 className="mr-3">Upload Image</h5>
        <input
          className="mt-3 mb-3"
          name="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
        />
      </div>
    );
  }, [allowEdit, handleFileInputChange]);

  const componentOutput = useMemo(() => {

    return (
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {imageUploader}
        {imageList}
        {confirmDeleteModal}
      </div>
    );
  }, [confirmDeleteModal, imageList, imageUploader]);

  return componentOutput;
}

export default ImageManagement;
