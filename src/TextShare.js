import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import './styles.css'; // Adjust the path if necessary
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert'; // Import the Alert component
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

function TextShare() {
  const [sharedText, setSharedText] = useState("");
  const sharedCollectionRef = collection(db, "textshare"); // Use "textshare" collection
  const [sharedData, setSharedData] = useState([]);
  const [showEmptyTextAlert, setShowEmptyTextAlert] = useState(false); // State for the empty text alert
  const [showShareSuccessAlert, setShowShareSuccessAlert] = useState(false); // State for the share success alert
  const [searchText, setSearchText] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState(null);

  const handleHover = (id) => {
    setHoveredMessage(id);
  };

  const handleUnhover = () => {
    setHoveredMessage(null);
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      const jsDate = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
      return jsDate.toLocaleString(); // Format the date as a string
    }
    return "{Fetching...}"; // Return an empty string if timestamp is undefined or does not have toDate function
  };

  const shareText = async () => {
    if (sharedText.trim() !== "") {
      try {
        const timestamp = serverTimestamp(); // Use serverTimestamp() to get the current server timestamp
        const newDocRef = await addDoc(sharedCollectionRef, {
          text: sharedText,
          timestamp: timestamp,
        });

        setSharedData([
          ...sharedData,
          { text: sharedText, timestamp: timestamp, id: newDocRef.id },
        ]);

        setSharedText("");
        setShowEmptyTextAlert(false);
        setShowShareSuccessAlert(true);

        setTimeout(() => {
          setShowShareSuccessAlert(false);
        }, 5000);
      } catch (error) {
        console.error("Error sharing text:", error);
      }
    } else {
      setShowEmptyTextAlert(true);

      setTimeout(() => {
        setShowEmptyTextAlert(false);
      }, 5000);
    }
  };

  const getSharedData = async () => {
    const data = await getDocs(sharedCollectionRef);
    setSharedData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteSharedData = async (id) => {
    try {
      const sharedDoc = doc(db, "textshare", id);
      await deleteDoc(sharedDoc);
      setSharedData(sharedData.filter((data) => data.id !== id));
    } catch (error) {
      console.error("Error deleting shared data:", error);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Text copied to clipboard");
      })
      .catch((error) => {
        console.error("Copy to clipboard failed:", error);
      });
  };

  useEffect(() => {
    getSharedData();
  }, []);

  const filteredSharedData = sharedData.filter((data) =>
    data.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card sx={{
      width: "90%",
      margin: "0 auto",
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
          placeholder=""
          sx={{
            width: '90%',
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
            width: '145px',
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

        <Typography gutterBottom variant="h7" component="div" sx={{marginTop:2,fontSize:"1rem"}} className="responsive-text">
          looking for anything?
        </Typography>

        <TextField
          id="search-text"
          label="Search Text"
          variant="outlined"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          sx={{
            width: '90%',
            marginTop: 1,
          }}
        />
        <ul style={{ padding: 0 }}>
          {filteredSharedData.map((data) => (
            <Card
              key={data.id}
              sx={{
                width: "90%",
                maxWidth: 300,
                marginTop: 2,
                boxShadow: 3,
                marginBottom: 3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                position: "relative",
              }}
              className="shared-card"
            >
              <li
                style={{
                  margin: 0,
                  padding: "15px 0px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {data.text}
                <CardActions className="full-card">
                  <div className="button-container">
                    <Button
                      onClick={() => copyText(data.text)}
                      variant="contained"
                      size="medium"
                      sx={{ marginRight: 1 }}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => deleteSharedData(data.id)}
                      size="medium"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                    <IconButton
                      onMouseEnter={() => handleHover(data.id)}
                      onMouseLeave={handleUnhover}
                    >
                      <InfoIcon />
                    </IconButton>
                  </div>
                </CardActions>
                {data.timestamp && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      right: "5px",
                      display: hoveredMessage === data.id ? "block" : "none",
                      background: "#fff",
                      padding: "5px",
                      borderRadius: "3px",
                    }}
                  >
                    Shared on {formatTimestamp(data.timestamp)}
                  </Typography>
                )}
              </li>
            </Card>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
export default TextShare;
