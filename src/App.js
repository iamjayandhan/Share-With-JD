import './App.css';
import TextShare from "./TextShare";
import FileShare from "./FileShare";
import React from "react";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Notice from './Notice';



function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="container">

      <Typography variant="h4"
          gutterBottom
          sx={{
            textAlign: 'center', // Center the text
    padding: '10px', // Add some padding
    borderRadius: '2px', // Add rounded corners
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 'bold', // Add a bold font weight
    backgroundColor: '#2196F3', // Set a background color
    color: 'white', // Set text color to white
          }}>
        ShareWithJD<a href="https://taplink.cc/iamjayandhan" target="_blank" rel="noopener noreferrer" style={{
    textDecoration: 'none', // Remove the underline
  }}>
  <span
    role="img"
    aria-label="Puzzle Piece"
    style={{
      cursor: 'pointer', // Change cursor to a pointer to indicate it's clickable
    }}
  >
    🧩
  </span>
</a>
      </Typography>
      <div className="content-container">
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Text Share" />
        <Tab label="File Share" />
      </Tabs>

      {value === 0 && <TextShare />}
      {value === 1 && <FileShare />}
      <Notice/>
    </div>
    </div>
  );
}

export default App;
