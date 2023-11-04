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
import Alert from '@mui/material/Alert'; // Import the Alert component

function TextShare() {
  const [sharedText, setSharedText] = useState("");
  const sharedCollectionRef = collection(db, "textshare"); // Use "textshare" collection
  const [sharedData, setSharedData] = useState([]);
  const [showEmptyTextAlert, setShowEmptyTextAlert] = useState(false); // State for the empty text alert
  const [showShareSuccessAlert, setShowShareSuccessAlert] = useState(false); // State for the share success alert

  const shareText = async () => {
    if (sharedText.trim() !== "") {
      try {
        const newDocRef = await addDoc(sharedCollectionRef, { text: sharedText });
        setSharedData([...sharedData, { text: sharedText, id: newDocRef.id }]);
        setSharedText("");
        setShowEmptyTextAlert(false); // Hide the empty text alert
        setShowShareSuccessAlert(true); // Show the share success alert

        // Hide the share success alert after a few seconds (e.g., 5 seconds)
        setTimeout(() => {
          setShowShareSuccessAlert(false);
        }, 5000);
      } catch (error) {
        console.error("Error sharing text:", error);
      }
    } else {
      setShowEmptyTextAlert(true); // Show the empty text alert

      // Hide the empty text alert after a few seconds (e.g., 5 seconds)
      setTimeout(() => {
        setShowEmptyTextAlert(false);
      }, 5000);
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
    <Card sx={{
      width: "90%", // Set a fixed width (100%)
      maxWidth: 500, // Set a maximum width (adjust as needed)
      margin: "0 auto", // Center the card
      padding: 0,
      boxShadow: 10,
      borderRadius: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }} className="left-component">
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Text Sharing
        </Typography>
        <TextField
          id="outlined-basic"
          label="Enter text"
          variant="outlined"
          value={sharedText}
          onChange={(event) => setSharedText(event.target.value)}
          placeholder="Enter text to share"
          sx={{
            width: '100%', // Set the width to 100% or adjust it as needed
          }}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={shareText}
          sx={{
            marginTop: 2,
            fontFamily: 'Raleway, sans-serif',
            marginLeft: 1,
            width: '145px', // Set a specific fixed width (adjust the value as needed)
          }}
        >
          Share Text
        </Button>
        {showEmptyTextAlert && (
          <Alert severity="error" sx={{ marginTop: 2 }}>Text input cannot be empty.</Alert>
        )}
        {showShareSuccessAlert && (
          <Alert severity="success" sx={{ marginTop: 2 }}>Text shared successfully!</Alert>
        )}
        <ul style={{ padding: 0 }}>
          {sharedData.map(data => (
            <Card sx={{
              width: "90%", // Set a fixed width (100%)
              maxWidth: 300, // Set a maximum width (adjust as needed)
              marginTop: 2,
              boxShadow: 3,
              marginBottom: 3,
              whiteSpace: 'nowrap', // Prevent text from wrapping
              overflow: 'hidden',
              textOverflow: 'ellipsis', // Add ellipsis for overflow
            }} className="shared-card" key={data.id}>
              <li style={{ margin: 0, padding: "15px 0px", paddingLeft: "10px", paddingRight: "10px", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {data.text}
                <CardActions className="full-card">
                  <div className="button-container">
                    <Button onClick={() => copyText(data.text)} variant="contained" size="medium" sx={{ marginRight: 1 }}>Copy</Button>
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
