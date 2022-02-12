import { useMemo } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

const UserSearchResult = (props) => {

  const {
    body,
    bodyText,
    onClose,
    onConfirm,
    show,
    title
  } = props;
    
  const componentOutput = useMemo(() => {

    const modalBody = body || <h5 className="mt-3">{bodyText}</h5>;

    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          {modalBody}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }, [
    body,
    bodyText,
    onClose,
    onConfirm,
    show,
    title
  ]);

  return componentOutput;
}

export default UserSearchResult;