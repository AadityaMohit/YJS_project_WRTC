 
import React, { useEffect, useRef } from 'react';
import { WebrtcProvider } from 'y-webrtc';
import * as Y from 'yjs';

const TextEditor = () => {
  const textareaRef = useRef(null);
  const doc = new Y.Doc();
  const roomName = 'my-room';  

  useEffect(() => {
    const provider = new WebrtcProvider(roomName, doc);

   
    const yText = doc.getText('text');

    
    yText.observe(() => {
      textareaRef.current.value = yText.toString();
    });
 
    const handleInput = (event) => {
      const newValue = event.target.value;
      const oldValue = yText.toString();
  
      const cursorPosition = event.target.selectionStart;
    
      if (newValue.length > oldValue.length) {
 
        const addedText = newValue.slice(cursorPosition - (newValue.length - oldValue.length), cursorPosition);
        yText.insert(cursorPosition - addedText.length, addedText);
      } else if (newValue.length < oldValue.length) {
 
        const deleteCount = oldValue.length - newValue.length;
        yText.delete(cursorPosition, deleteCount);
      }
     
      setTimeout(() => {
        textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    };
    
    

    textareaRef.current.addEventListener('input', handleInput);

    return () => {
      textareaRef.current.removeEventListener('input', handleInput);
      provider.destroy();  
    };
  }, [doc]);

  return (
    <div>
      <h1> Testing feature of YJS</h1>
      <textarea
        ref={textareaRef}
        rows="10"
        cols="30"
        placeholder="Start typing..."
      />
    </div>
  );
};

export default TextEditor;

