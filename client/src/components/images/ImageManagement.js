import {
  useCallback,
  useMemo
} from 'react';

import api from '../../api/api';

import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

import './css/ImageManagement.css';


const ImageManagement = (props) => {

  // type can be 'animal' or 'user'
  const {
    allowEdit,
    avatarImageUrl = '/images/no_image.svg',
    petName,
    shelterName,
    onUploadImage,
    type
  } = props;

  const apiLibrary = useMemo(() => {
  
    if (type === 'animal') {
      return api.Animal;
    }

    if (type === 'user') {
      return api.User;
    }
  }, [type]);

  const handleUploadFile = useCallback((evt) => onUploadImage(evt), [onUploadImage]);

  const handleFileInputChange = useCallback((evt) => {

    if (!evt.currentTarget.value) {
      return;
    }

    // const reader = new FileReader();
    // reader.readAsDataURL(evt.currentTarget.files[0]);
    // reader.onloadend = handleUploadFile;
    handleUploadFile(evt.currentTarget.files[0]);
  }, [handleUploadFile]);

  const avatarImage = useMemo(() => {

    let imageClass = 'imageWrapper';

    return (
      <div className={imageClass}>
        <Image
          rounded
          src={avatarImageUrl}
          height="250"
        />
      </div>
    );
  }, [allowEdit, avatarImageUrl]);

  const imageUploader = useMemo(() => {

    if (!allowEdit) {
      return null;
    }

    return (
      <div className="w-100 d-flex justify-content-center align-items-center">
        <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload Image</Form.Label>
          <Form.Control
            className="mt-3 mb-3"
            name="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
          />
        </Form.Group>
      </div>
    );
  }, [allowEdit, handleFileInputChange]);

  const componentOutput = useMemo(() => {

    return (
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {imageUploader}
        {avatarImage}
      </div>
    );
  }, [avatarImage, imageUploader]);

  return componentOutput;
}

export default ImageManagement;
