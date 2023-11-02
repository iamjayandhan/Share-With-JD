import React, { useState, useEffect } from "react";
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
  const sharedCollectionRef = collection(db, "textshare"); // Use "textshare" collection
  const [sharedData, setSharedData] = useState([]);

  const shareText = async () => {
    if (sharedText.trim() !== "") {
      try {
        const newDocRef = await addDoc(sharedCollectionRef, { text: sharedText.trim() });
        setSharedData([...sharedData, { text: sharedText.trim(), id: newDocRef.id }]);
        setSharedText("");
      } catch (error) {
        console.error("Error sharing text:", error);
      }
    } else {
      alert("Text input cannot be empty.");
    }
  }

  const getSharedData = async () => {
    const data = await getDocs(sharedCollectionRef);
    setSharedData(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  }

  const deleteSharedData = async (id) => {
    try {
      const sharedDoc = doc(db, "textshare", id);
      await deleteDoc(sharedDoc);
      setSharedData(sharedData.filter(data => data.id !== id));
    } catch (error) {
      console.error("Error deleting shared data:", error);
    }
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

  }, []);

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
