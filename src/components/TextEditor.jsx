 
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

    
      yText.delete(0, yText.length);
      yText.insert(0, newValue);
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

