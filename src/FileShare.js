import { useState, useEffect, useCallback } from "react";
import { db, storage } from "./firebase";
import './styles.css';

import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

function FileShare() {
  const [sharedText, setSharedText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [customFileName, setCustomFileName] = useState("");
  const sharedCollectionRef = collection(db, "shared_data");
  const [sharedData, setSharedData] = useState([]);

  // Use a local cache to minimize reads
  const [dataCache, setDataCache] = useState([]);

  const shareData = async () => {
    try {
      if (selectedFile) {
        let fileName = customFileName || selectedFile.name; // Use customFileName or the original file name
        const fileRef = ref(storage, `files/${fileName}`);
        console.log("Uploading file:", fileName); // Add upload log
        await uploadBytes(fileRef, selectedFile);
        console.log("File uploaded:", fileName); // Add upload success log
        const downloadURL = await getDownloadURL(fileRef);
        console.log("File URL:", downloadURL); // Add download URL log
        await addDoc(sharedCollectionRef, { fileURL: downloadURL });
        console.log("Shared data added to Firestore:", downloadURL); // Add shared data log
        setCustomFileName(""); // Clear the customFileName input
      } else if (sharedText) {
        await addDoc(sharedCollectionRef, { text: sharedText });
      }
      setSharedText("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error sharing data:", error);
    }
  }

  const getSharedData = useCallback(async () => {
    // Set up a listener for real-time updates
    onSnapshot(sharedCollectionRef, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDataCache(updatedData);
    });
  }, [sharedCollectionRef]);

  const deleteSharedData = async (id, fileURL) => {
    try {
      console.log("Deleting shared data with ID:", id);
      if (fileURL) {
        const fileName = getFileNameFromURL(fileURL);
        console.log("File URL:", fileURL);
        console.log("File Name:", fileName);
        const fileRef = ref(storage, `files/${fileName}`);
        console.log("File Reference:", fileRef);
        try {
          await getDownloadURL(fileRef);
          console.log("File exists. Deleting from Firebase Storage...");
          await deleteObject(fileRef);
          console.log("File deleted from Firebase Storage.");
        } catch (error) {
          console.log("File does not exist in Firebase Storage.");
        }
      }
      console.log("Deleting shared data document from Firestore...");
      const sharedDoc = doc(db, "shared_data", id);
      await deleteDoc(sharedDoc);
      console.log("Shared data document deleted from Firestore.");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }

  const getFileNameFromURL = (fileURL) => {
    try {
      const url = new URL(fileURL);
      const path = url.pathname;
      const pathComponents = path.split('/');
      if (pathComponents.length >= 2) {
        return decodeURIComponent(pathComponents[pathComponents.length - 1]);
      } else {
        console.error("Invalid file URL:", fileURL);
        return null;
      }
    } catch (error) {
      console.error("Error constructing URL:", error);
      return null;
    }
  }

  const downloadFile = (fileURL) => {
    const a = document.createElement('a');
    a.href = fileURL;
    a.target = '_blank';
    a.download = getFileNameFromURL(fileURL);
    a.click();
  };

  useEffect(() => {
    getSharedData();
  }, [getSharedData]);

  useEffect(() => {
    setSharedData(dataCache);
  }, [dataCache]);

  return (
    <div className="right-component">
      <h2>File Sharing</h2>
      <input
        type="file"
        accept="image/*, .pdf, .doc, .docx"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Custom File Name (optional)"
        value={customFileName}
        onChange={(event) => setCustomFileName(event.target.value)}
      />
      <button className="share-file-button" onClick={shareData}>Share File</button>

      <ul>
        {sharedData.map(data => (
          <li key={data.id}>
            {data.text && <div><strong>Text:</strong> {data.text}</div>}
            {data.fileURL && (
              <div>
                <strong>File Name:</strong> {
                  getFileNameFromURL(data.fileURL)
                }
              </div>
            )}
            <div className="button-container">
              {data.fileURL && (
                <button onClick={() => downloadFile(data.fileURL)} className="download-button">Download</button>
              )}
              <button onClick={() => deleteSharedData(data.id, data.fileURL)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileShare;
