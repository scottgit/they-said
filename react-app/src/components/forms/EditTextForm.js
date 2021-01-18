import React, {useRef, useState, useEffect, useCallback} from 'react';
import ReactDOMServer from 'react-dom/server';
import {useHistory} from 'react-router-dom';
import  {Editor } from '@tinymce/tinymce-react';
import DOMPurify from "dompurify";
import {editText, deleteText} from '../../services/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../includes/ConfirmModal';
import useEffectAsyncSafeFetch from "../../services/useEffectAsyncSafeFetch";


const EditTextForm = ({currentUser, itemData, title, setItemData, setContentDisplayed

, contentDisplayed


}) => {
  const EDITOR = useRef();
  const [feedback, setFeedback] = useState('');
  const [textDetails, _setTextDetails] = useState({})
  const initialState = useRef({...itemData});
  // const [editorKey, setEditorKey] = useState(0);
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const redirect = useRef(null);
  // const [editorKey, setEditorKey] = useState('editorKey-'+Date.now());
  const doSaveRef = useRef(null);
  const savedMsg = 'Saved! (Message removed in 1 second.)';

  // Code for Delete of the text item, with modal confirmation
  // Initiated in the Editor Delete action
  const history = useHistory();

  useEffect(() => {
    let stillMounted = true;
    console.log('IN REDIRECT', redirect.current)
    if (redirect === true) {
      redirect.current = false;
      alert('done')
      // setTimeout(() => {
      //   if (stillMounted) {
      //     history.push('');
      //   }
      // }, 2000);
    }
    return function cleanUp() {
      stillMounted = false;
    }
  }, [redirect, history])

  const handleShowModal = () => {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const setTextDetails = (details) => {
    _setTextDetails({...textDetails, ...details});
  };

  if (!textDetails.content) {
    setTextDetails(initialState.current);
  }

  const handleDelete = async () => {
    //Protected by a confirm modal
    setErrors([]);
    const pathInfo = textDetails.id;
    const sendData = {createdByUserId: currentUser.id};
    try {
      const msg = await deleteText(pathInfo, sendData);
      if (msg.success) {
        setFeedback("File deleted! Redirecting in 2 seconds.");
        // handleCloseModal();
        setTimeout(() => {
          if (true) {
            history.push('');
          }
        }, 2000);
      }
    } catch (err) {
      setErrors(err.errors)
    }
  }


  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (feedback === '' || feedback === savedMsg) return;

    setErrors([]);
    const wordCount = EDITOR.current.plugins.wordcount.body.getWordCount();
    const source = (textDetails.source.includes('(with additional edits)')
    ? textDetails.source
    : textDetails.source + ' (with additional edits)');
    const content = DOMPurify.sanitize(textDetails.content, {FORBID_TAGS: ['img']});

    const newData ={
            ...textDetails,
            title,
            content,
            source,
            wordCount,
            createdByUserId: currentUser.id
          }

    try {
      const data = await editText(textDetails.id, newData);
      if(data.errors) {
        throw data;
      }
      else {
        setFeedback(savedMsg);
        setTimeout(() => setItemData({...data}), 1000);
      }
    } catch (err) {
      console.log('err', err)
      setErrors(err.errors)
    }
  }



  const modalProps = {showModal, handleCloseModal, affirmAction: handleDelete, message: `Delete file titled "${title}"?`}

  // Code for Edit of text item
  // Initiated via the Editor Save action (triggered by Editor rerender because of bugs otherwise)
  const handleEditorChange = (content, editor) => {
    setTextDetails({content});
  }

  const EditorComp = (
    <Editor
        apiKey={process.env.REACT_APP_TINY_API}
        initialValue={null}
        value={textDetails.content}
        onEditorChange={handleEditorChange}
        init={{
          height: '100%',
          resize: false,
          menu: {
          file: {title: 'File', items: 'save delete | preview | print'},
          edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
          view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen' },
          insert: { title: 'Insert', items: 'link  template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime' },
          format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat' },
          tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount' },
          table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' },
          help: { title: 'Help', items: 'help' }
          },
          plugins: [
            'advlist autolink lists charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            setup: (editor) => {
              EDITOR.current = editor;

              // Custom Icons for Menu
              editor.ui.registry.addIcon('save', ReactDOMServer.renderToString(<FontAwesomeIcon icon={faSave} />));
              editor.ui.registry.addIcon('trash', ReactDOMServer.renderToString(<FontAwesomeIcon icon={faTrash} />));

              // Custom Menu Items
              editor.ui.registry.addMenuItem('save', {
                icon: 'save',
                text: `Save`,
                onAction: (editor) => {
                  // This callback was enclosing handleSave and not passing updated textDetails data on save, so I needed to have it use a button element outside itself handle the save event.
                  doSaveRef.current.click();
                }
              });
              editor.ui.registry.addMenuItem('delete', {
                icon: 'trash',
                text: 'Delete',
                onAction: () => handleShowModal()
              });
              // Let header know editor is setup to display
              editor.on('LoadContent', function(e) {
                setContentDisplayed(true);
              });
            }
        }}
       />
  )

  // useEffectAsyncSafeFetch( (() => { // Wrapping IIFE to preprocess data
  //   if (feedback === '' || feedback === savedMsg || !doSaveRef.current) return {} //Set nothing to run no effect
  //   // Process needed values to pass to the data object
  //   const source = (textDetails.source.includes('(with additional edits)')
  //   ? textDetails.source
  //   : textDetails.source + ' (with additional edits)');
  //   const content = DOMPurify.sanitize(textDetails.content, {FORBID_TAGS: ['img']});
  //   // Return the settings object for useEffectAsyncSafeFetch
  //   return {
  //     initCb: () => setErrors([]),
  //     //actionCondition: true,    // use default to make fetch call automatic
  //     fetchFn: editText,
  //     pathEndpoint: textDetails.id,
  //     fetchData: {
  //       ...textDetails,
  //       title,
  //       content,
  //       source,
  //       createdByUserId: currentUser.id
  //     },
  //     successCb: (data) => {
  //       setFeedback(savedMsg);
  //       // Save at a higher level to update all links
  //       // This redraws component after showing feedback for 1 second
  //       doSaveRef.current = false
  // debugger
  //       setTimeout(() => setItemData({...data}), 1000);
  //     },
  //     // backupCondition: false,   //use bypass default
  //     // backupCb=() => null,      //use backup default (not executed per condition)
  //     // defaultCb=() => null,     //use default which is do nothing if actionCondition not passed
  //     errorCb: (err) => {
  //       setFeedback('***ERROR***: Failed to save! ');
  //       setErrors(err.errors);
  //       doSaveRef.current = false
  //     }
  //   }
  // })(), [doSaveRef.current])

  useEffect(() => {
    let stillMounted = true;
    const init = initialState.current;
    const content = textDetails.content;
    if (title && content
        && (title !== init.title || content !== init.content)
        && stillMounted
      ) {
      setFeedback('You have unsaved changes.');
    } else if (stillMounted) {
      setFeedback('');
    }
    return function cleanUp() {
      stillMounted = false;
    }
  }, [title, textDetails])

  // // When rendering of text content is done of content, then show the title loaded
  // useEffect(() => {
  //   let stillMounted = true;
  //   if (stillMounted && setup.current === initialState.current) {
  //     setContentDisplayed(true);
  //   }
  //   return function cleanUp() {
  //     stillMounted = false;
  //   }
  // }, [initialState.current, setup.current, setContentDisplayed])

  // The actual Render Method

  return (
    <div className="ev-text-edit">
      {feedback && <div className={feedback === savedMsg ? 'ev-success' : 'ev-error'}>{feedback}</div>}
      <button ref={doSaveRef} style={{display: 'none', visibility: 'hidden'}} onClick={handleSave}></button>
      { (!!errors.length) &&
        <div className="ev-form-errors" key={`${errors}`}>
          {errors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </div>
      }
      {EditorComp}
      <ConfirmModal {...modalProps} />
    </div>
  )

}

export default EditTextForm
