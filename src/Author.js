import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

const Author = () => {
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
      <div className="author" style={{ textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold' }}>
          404 Error
        </h3>
        <p className="bio-text">Page not found.</p>
        <Button variant="outlined" href="/" color="primary">
          Go to Homepage
        </Button>
      </div>
    </Card>
  );
};

export default Author;
