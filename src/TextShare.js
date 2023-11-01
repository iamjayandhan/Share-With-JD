import React, { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import './styles.css'; // Adjust the path if necessary
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function TextShare() {
  const [sharedText, setSharedText] = useState("");
  const textShareCollectionRef = collection(db, "textshare"); // Use "textshare" collection
  const [sharedData, setSharedData] = useState([]);

  const shareText = async () => {
    if (sharedText.trim() !== "") { // Check if the input is not empty or only contains whitespace
      await addDoc(textShareCollectionRef, { text: sharedText.trim() }); // Use the "textshare" collection and trim the input
      setSharedText("");
    }
  }

  const getSharedData = useCallback(async () => {
    const data = await getDocs(textShareCollectionRef); // Use the "textshare" collection
    setSharedData(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  }, [textShareCollectionRef]);

  const deleteSharedData = async (id) => {
    const sharedDoc = doc(db, "textshare", id); // Use the "textshare" collection
    await deleteDoc(sharedDoc);
    getSharedData();
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Text copied to clipboard");
      })
      .catch((error) => {
        console.error("Copy to clipboard failed:", error);
      });
  }

  useEffect(() => {
    getSharedData();
  }, [getSharedData]);

  return (
    <div className="left-component">
      <h2>Text Sharing</h2>
      <textarea
        value={sharedText}
        onChange={(event) => setSharedText(event.target.value)}
        placeholder="Enter text to share"
      />
      <button onClick={shareText}>Share Text</button>
      <ul>
        {sharedData.map(data => (
          <li key={data.id}>
            {data.text}
            <div className="button-container">
              <button onClick={() => copyText(data.text)} className="copy-button">Copy</button>
              <button onClick={() => deleteSharedData(data.id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TextShare;
