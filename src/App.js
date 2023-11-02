import './App.css';
import TextShare from "./TextShare";
import FileShare from "./FileShare";
import React from "react";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';



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
            borderRadius: '8px', // Add rounded corners
            fontFamily: 'Open Sans, sans-serif'
          }}>
        Share Hub❤️
      </Typography>

      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Text Share" />
        <Tab label="File Share" />
      </Tabs>

      {value === 0 && <TextShare />}
      {value === 1 && <FileShare />}

    </div>
  );
}

export default App;
