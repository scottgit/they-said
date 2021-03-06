import React, {useState} from 'react';
import ReactModal from 'react-modal';
import FAI from './FAI';
import { faFile, faPlus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import AddTextForm from '../forms/AddTextForm';


ReactModal.setAppElement('#root');

const AddTextButton = ({currentUser, setCurrentUser, hide=false}) => {
  const [showModal, setShowModal] = useState(false)
  hide = hide ? '--hide' : '';

  const handleShowModal = (e) => {
    setShowModal(true);
  }

  const handleCloseModal = (e) => {
    setShowModal(false);
  }

  return (
    <>
      <span className={`fa-layers fa-fw --hover-sub-tilt ${hide}`} onClick={handleShowModal} tabIndex="0" title={`Add Text`} >
        <FAI icon={faFile} className="ev-icon --dark" />
        <FAI icon={faPlus} className="ev-icon --sub --lc" />
      </span>
      <ReactModal
        isOpen={showModal}
        closeTimeoutMS={500}
        overlayClassName="ev-modal-overlay"
      >
        <button className="ev-button button icon ev-modal-close" onClick={handleCloseModal}>
          <FAI icon={faWindowClose} />
        </button>
          <AddTextForm currentUser={currentUser} setCurrentUser={setCurrentUser} handleCloseModal={handleCloseModal}/>
      </ReactModal>
    </>
  )
}

export default AddTextButton
