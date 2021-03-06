import React, { createContext, useContext, useState } from 'react';
import {useHistory} from 'react-router-dom';
import ClaimSection from './groupings/ClaimSection';
import ClaimArgumentsSections from './groupings/ClaimArgumentsSections';
import UIDProvider from '../includes/UIDProvider';
import {createClaim} from '../../services/claim';
import { updateCurrentUserInfo } from '../../services/user';
import FormHeader from '../includes/FormHeader';
import processHitKeys from '../../services/processHitKeys';

const ClaimFormContext = createContext();

const ADD_CLAIM_FORM = ({currentUser, setCurrentUser, handleCloseModal}) => {
  const formContext = useContext(ClaimFormContext);
  const [showConfirm, setShowConfrim] = useState(false);
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const data = {
      assertion: formContext.assertion,
      claimNotes: formContext.notes,
      hitKeys: processHitKeys(formContext.hitKeys),
      createdByUserId: currentUser.id,
      newArguments: Object.values(formContext.argumentsSet),
      existingArguments: [] //TODO implement ability to link existing arguments as well
    }

    try {
      const claim = await createClaim(data);
      if (!claim.errors) {
        handleCloseModal();
        updateCurrentUserInfo(setCurrentUser, currentUser.id);
        setTimeout(() => history.push(`/claim/view/${claim.id}`), 400)
      }
    } catch (err) {
      setErrors(err.errors)
    }
  }

  const toggleShowConfirm = (e) => {
    setShowConfrim(!showConfirm);
  }

  const doCancel = (e) => {
    handleCloseModal()
  }

  const headerProps = {headerTitle: 'Create Claim', errors, doCancel, showConfirm, toggleShowConfirm}

  return (
    <div className="ev-claim-create">
      <form id="create-claim" method="POST" onSubmit={handleSubmit}>
        <FormHeader {...headerProps} />
        <UIDProvider passToGroup={true}>
          <ClaimSection />
          <ClaimArgumentsSections />
        </UIDProvider>
      </form>
    </div>
  )
}

const AddClaimForm = (props) => {
  return (
    <ClaimFormContext.Provider value={{
      assertion: '',          // Sent to database
      notes: '',              // Sent to database
      hitKeys: '',
      argumentsSet: {},       // Modified to array of values and sent to database
      pairedArgIds: []        // Track which arguments are paired
    }}>
      <ADD_CLAIM_FORM {...props} />
    </ClaimFormContext.Provider>
  )
}

export {AddClaimForm, ClaimFormContext};
