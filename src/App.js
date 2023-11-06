import './App.css';
import TextShare from "./TextShare";
import FileShare from "./FileShare";
import React from "react";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Notice from './Notice';
import Author from './Author';
import TestVantaBirds from './TestVantaBirds'; // Replace with the correct path to your component file




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
    backgroundColor: 'white', // Set a background color
    color: 'black', // Set text color to white
          }}>
        ShareWithJD
      </Typography>
      <div className="content-container">
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Text Share" />
        <Tab label="File Share" />
        <Tab label="Author" />
        <Tab label="Dev" />
      </Tabs>

      {value === 0 && <TextShare />}
      {value === 1 && <FileShare />}
      {value === 2 && <Author />}
      {value === 3 && <TestVantaBirds backgroundColor="black" birdSize={1}/>}
      <Notice/>
    </div>
    </div>
  );
}

export default App;
