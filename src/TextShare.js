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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';


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
      <Card sx={{width: "100%", // Set the width to a percentage value
      borderRadius: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
      }} className="left-component">
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Text Sharing
        </Typography>
        {/* <textarea
          value={sharedText}
          onChange={(event) => setSharedText(event.target.value)}
          placeholder="Enter text to share"
        /> */}
        <TextField id="outlined-basic" label="Enter text" variant="outlined" value={sharedText}
          onChange={(event) => setSharedText(event.target.value)}
          placeholder="Enter text to share"/>
        <Button variant="contained" endIcon={<SendIcon />} onClick={shareText} sx={{ marginLeft:3 }}>Share Text</Button>
        <ul>
          {sharedData.map(data => (
                <Card sx={{ width:600, marginTop:1 ,left:10}}>

            <li key={data.id} style={{ margin: "8px 0" }}>
            {data.text}
            <CardActions>
              <div className="button-container">
                <Button  onClick={() => copyText(data.text)} variant="contained" size="medium" sx={{marginRight:1}} >Copy</Button>

                <Button variant="contained" onClick={() => deleteSharedData(data.id)} size="medium">Delete</Button>
              </div>
              </CardActions>

            </li>
            </Card>

          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default TextShare;
