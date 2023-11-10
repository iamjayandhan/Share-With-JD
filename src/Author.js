import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CELLS from 'vanta/src/vanta.cells';
import { useEffect } from 'react';
import './App.css';

const Author = () => {

    useEffect(() => {
      CELLS({
        el: "#vanta",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        size: 0.80
      })
    })
    return (
    <Card
      sx={{
        width: '78%',
        borderRadius: 2,
        boxShadow: 10,
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -0.2,
      }}
      className="file-share-card"
    >
      {/* <div className='bg' > */}
      <div className="author"  style={{ textAlign: 'center' }}>
      
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold' }}>
          404 Error
        </h3>
        <div className='bg' id='vanta'></div>
        <p className="bio-text">Page not found.</p>
        <Button variant="outlined" href="/" color="primary">
          Go to Homepage
        </Button>
        </div>
      {/* </div> */}
    </Card>
  );
};

export default Author;
