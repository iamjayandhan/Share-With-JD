import React, { useEffect, useState } from "react";
import { storage } from "./firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  getMetadata,
} from "firebase/storage";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

function FileShare() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    fetchFiles();

    // Add event listeners for drag-and-drop
    const dropArea = document.getElementById("file-drop-area");
    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("drop", handleDrop);

    // Clean up the event listeners when the component unmounts
    return () => {
      dropArea.removeEventListener("dragover", handleDragOver);
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, []);

  const fetchFiles = async () => {
    const storageRef = ref(storage, "uploaded_files");
    const filesList = await listAll(storageRef);
    const fileUrls = await Promise.all(
      filesList.items.map(async (item) => {
        const metadata = await getMetadata(item);
        return {
          name: item.name,
          downloadUrl: await getDownloadURL(item),
          timestamp: metadata.timeCreated, // Use timeCreated from metadata as the timestamp
        };
      })
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
    const selectedFiles = e.target.files;
    setSelectedFiles([...selectedFiles]);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setShowSuccessAlert(false);
      setShowErrorAlert(true);

      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
      return;
    }

    setUploading(true);
    const promises = selectedFiles.map((file) => {
      const storageRef = ref(storage, `uploaded_files/${file.name}`);
      const task = uploadBytesResumable(storageRef, file);

      task.on("state_changed", (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: progress,
        }));
      });

      return task;
    });

    try {
      await Promise.all(promises);
      setUploading(false);
      setShowSuccessAlert(true);
      setSelectedFiles([]);
      fetchFiles();

      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    } catch (error) {
      console.error("Error uploading files:", error);
    }

    const dropArea = document.getElementById("file-drop-area");
    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("drop", handleDrop);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    setSelectedFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
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

        <label
          id="file-drop-area"
          style={{
            border: "2px dashed rgb(204, 204, 204)",
            borderRadius: "4px",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            display: "block",
          }}
        >
          <div>Drag and drop a file here or click to select one</div>
          <input
            type="file"
            onChange={handleFileChange}
            id="file-input"
            style={{ display: "none" }}
            multiple
          />
        </label>

        {uploading ? (
          <Button variant="outlined" disabled>
            <CircularProgress size={20} sx={{ marginRight: 1 }} /> Uploading
          </Button>
        ) : (
          <Button
            onClick={uploadFiles}
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ marginTop: "20px" }}
          >
            Upload Files
          </Button>
        )}

        {showSuccessAlert && (
          <Alert severity="success" sx={{ marginTop: "20px" }}>
            Files uploaded successfully!
          </Alert>
        )}

        {showErrorAlert && (
          <Alert severity="error" sx={{ marginTop: "20px" }}>
            Please select one or more files to upload.
          </Alert>
        )}

        {selectedFiles.length > 0 && (
          <div>
            <Typography variant="h6" component="div" sx={{ marginTop: "20px" }}>
              Selected Files:
            </Typography>
            <ul>
              {selectedFiles.map((file) => (
                <li key={file.name}>
                  {file.name} -{" "}
                  {uploadProgress[file.name]
                    ? `${uploadProgress[file.name].toFixed(2)}%`
                    : "Queued"}
                </li>
              ))}
            </ul>
          </div>
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
          sx={{ width: "19rem", marginBottom: "30px" }}
        />

        {filteredFiles.map((file) => (
          <div
            key={file.name}
            sx={{
              margin: "8px 0",
            }}
            className="file-entry"
          >
            <div>
              <Typography variant="subtitle1">{file.name}</Typography>
              <Typography variant="caption" color="textSecondary">
                Uploaded on: {new Date(file.timestamp).toLocaleString()}
              </Typography>
            </div>
            <CardActions sx={{ marginBottom:3}}>
              <Button
                variant="contained"
                component="a"
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
