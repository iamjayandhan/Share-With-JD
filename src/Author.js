import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import DOT from 'vanta/src/vanta.dots';
import { useEffect } from 'react';
import './App.css';

const Author = () => {

    useEffect(() => {
      DOT({
        el: "#vanta",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        spacing: 27.00
        // mouseControls: true,
        // touchControls: true,
        // gyroControls: false,
        // minHeight: 100.00,
        // minWidth: 200.00,
        // highlightColor: 0x5eff00,
        // midtoneColor: 0xff0b,
        // lowlightColor: 0x20d9d6,
        // baseColor: 0x1a0000,
        // zoom: 1.9,
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
      
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold' ,marginTop:-5}}>
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
