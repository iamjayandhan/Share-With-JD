import React, { useEffect, useState } from "react";
import { storage } from "./firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

function FileShare() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    fetchFiles(); // Initial fetch of files on component load
  }, []);

  const fetchFiles = async () => {
    const storageRef = ref(storage, "uploaded_files");
    const filesList = await listAll(storageRef);
    const fileUrls = await Promise.all(
      filesList.items.map(async (item) => ({
        name: item.name,
        downloadUrl: await getDownloadURL(item),
      }))
    );
    setFiles(fileUrls);
  };

  const deleteFile = async (fileName) => {
    const storageRef = ref(storage, `uploaded_files/${fileName}`);
    await deleteObject(storageRef);
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `uploaded_files/${file.name}`);
      setUploading(true);
      await uploadBytes(storageRef, file);
      setUploading(false);
      setShowSuccessAlert(true); // Show the success alert
      setShowErrorAlert(false); // Hide the error alert if it was shown
      fetchFiles(); // Fetch the updated file list after a successful upload
  
      // Hide the success alert after a few seconds (e.g., 5 seconds)
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    } else {
      setShowSuccessAlert(false); // Hide any previous success alert
      setShowErrorAlert(true); // Show the error alert
  
      // Hide the error alert after a few seconds (e.g., 5 seconds)
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    }
  
    // Reset the file input field to allow selecting a different file
    document.getElementById("file-input").value = "";
  };
  

  // Filter the files based on the search term
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <Card
      sx={{
        width: "78%",
        borderRadius: 2,
        boxShadow: 10,
        padding: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -0.2,
      }}
      className="file-share-card"
    >
      <div>
        <Typography gutterBottom variant="h5" component="div">
          File Sharing
        </Typography>
        {/* <input
          type="file"
          onChange={handleFileChange}
          id="file-input"
          sx={{ marginBottom: "20px" }}
        /> */}

      <label style={{ border: "2px dashed rgb(204, 204, 204)", borderRadius: "4px", padding: "20px", textAlign: "center", cursor: "pointer", display: "block" }}>
          <div>Drag and drop a file here or click to select one</div>
          <input
            type="file"
            onChange={handleFileChange}
            id="file-input"
            style={{ display: "none" }}
          />
        </label>



        {uploading ? (
          <Button variant="outlined" disabled>
            <CircularProgress size={20} sx={{ marginRight: 1 }} /> Uploading
          </Button>
        ) : (
          <Button
            onClick={handleUpload}
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ marginTop: "20px" }}
          >
            Upload File
          </Button>
        )}

        {showSuccessAlert && (
          <Alert severity="success" sx={{ marginTop: "20px" }}>
            File uploaded successfully!
          </Alert>
        )}

        {showErrorAlert && (
          <Alert severity="error" sx={{ marginTop: "20px" }}>
            Please select a file to upload.
          </Alert>
        )}

        <Typography gutterBottom variant="h5" component="div" sx={{ marginTop: "40px" }}>
          Uploaded Files
        </Typography>

        {/* Search input */}
        <TextField
          type="text"
          placeholder="Search files"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width:"19rem", marginBottom: "30px" }}
        />

        {filteredFiles.map((file) => (
          <div
            key={file.name}
            sx={{
              margin: "8px 0", // Add spacing between file entries
            }}
            className="file-entry"
          >
            {file.name}
            <CardActions>
              <Button
                variant="contained"
                component="a"
                href="#as-link"
                href={file.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ marginRight: "10px" }}
              >
                Download
              </Button>

              <Button
                onClick={() => deleteFile(file.name)}
                variant="outlined"
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </CardActions>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default FileShare;
