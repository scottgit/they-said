import React from 'react';
import FormTextAreaInputPackage from './FormTextAreaInputPackage';

const AddArgumentNotesField = ({uniqueId, setArgListData}) => {
  return (
    <FormTextAreaInputPackage
      fieldType="Argument Notes"
      uniqueId={uniqueId}
      formSetterFn={setArgListData}
      settings={
        {
          label: 'Notes',
          explanation: `The argument's notes provide an optional space to add any further information that may help one understand the statement the argument is making about the claim.`,
          maxLength: 600,
          placeholder: "(Optional)",
          rows: 4
        }
    }/>
  )
}

export default AddArgumentNotesField
