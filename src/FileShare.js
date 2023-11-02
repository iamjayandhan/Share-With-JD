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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";

function FileShare() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      fetchFiles(); // Fetch the updated file list after successful upload
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <Typography gutterBottom variant="h5" component="div">
          File Sharing
        </Typography>
        <input type="file" onChange={handleFileChange} />
        {uploading ? (
          <Button variant="outlined" disabled>
            <CircularProgress size={20} sx={{ marginRight: 1 }} /> Uploading
          </Button>
        ) : (
          <Button onClick={handleUpload} variant="outlined" startIcon={<CloudUploadIcon />}>
            Upload File
          </Button>
        )}

        {files.map((file) => (
          <div
            key={file.name}
            sx={{
              margin: "8px 0", // Add spacing between file entries
            }}
          >
            {file.name}
            <CardActions>
              <Button
                variant="outlined"
                component="a"
                href="#as-link"
                href={file.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </Button>

              <Button onClick={() => deleteFile(file.name)} variant="outlined" startIcon={<DeleteIcon />}>
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
