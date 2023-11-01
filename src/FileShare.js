import { useState, useEffect, useCallback } from "react";
import { db, storage } from "./firebase";
import './styles.css'; // Adjust the path if necessary

import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function FileShare() {
  const [sharedText, setSharedText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [customFileName, setCustomFileName] = useState(""); // Add custom file name state
  const sharedCollectionRef = collection(db, "shared_data");
  const [sharedData, setSharedData] = useState([]);

  const shareData = async () => {
    if (selectedFile) {
      let fileName = customFileName || selectedFile.name;
      const fileRef = ref(storage, `files/${fileName}`);
      await uploadBytes(fileRef, selectedFile);
      const downloadURL = await getDownloadURL(fileRef);
      await addDoc(sharedCollectionRef, { fileURL: downloadURL });
    } else {
      await addDoc(sharedCollectionRef, { text: sharedText });
    }
    setSharedText("");
    setSelectedFile(null);
    setCustomFileName(""); // Reset custom file name
  }
  

  const getSharedData = useCallback(async () => {
    const data = await getDocs(sharedCollectionRef);
    setSharedData(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
}, [sharedCollectionRef]);

  const deleteSharedData = async (id) => {
    const sharedDoc = doc(db, "shared_data", id);
    await deleteDoc(sharedDoc);
    getSharedData();
  }

  function getFileNameFromURL(fileURL) {
    const url = new URL(fileURL);
    const path = url.pathname;
    const parts = path.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
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
          <strong>File Name:</strong> {getFileNameFromURL(data.fileURL)}
        </div>
      )}
      <div className="button-container">
        {data.fileURL && (
          <button onClick={() => downloadFile(data.fileURL)} className="download-button">Download</button>
        )}
        <button onClick={() => deleteSharedData(data.id)} className="delete-button">Delete</button>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}

export default FileShare;
