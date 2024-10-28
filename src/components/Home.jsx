import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';  
import * as Y from 'yjs';
import { YFirebaseProvider } from 'y-firebase-provider';
function Home() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      saveContent(json); 
    },
  });
 
  const saveContent = async (content) => {
    try {
      console.log('Saving content to Firestore...');
      await setDoc(doc(db, 'Yjsnotes', 'YjsmyNote'), { content }); 
      console.log('Content saved to Firestore');
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'Yjsnotes', 'YjsmyNote');
        const docSnap = await getDoc(docRef);  

        if (docSnap.exists() && editor) {
          console.log('Document found, loading content...');
          editor.commands.setContent(docSnap.data().content);  
        } else {
          console.log('Document not found, creating new one with default content...');
          const defaultContent = {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Start writing here...' }],
              },
            ],
          };
          await setDoc(docRef, { content: defaultContent }); 
          editor.commands.setContent(defaultContent); 
          console.log('New document created with default content');
        }
      } catch (error) {
        console.error('Error loading or creating document:', error);
      }
    };

    if (editor) {
      console.log('Editor initialized, loading content...');
      loadContent();   
    }
  }, [editor]);

  return (
    <div>
      <h1>Dynamic Tiptap Editor with Firebase</h1>
      <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default Home;
