import React from 'react';
import { Link } from '@inertiajs/react';
import { Typography, Button, Box } from '@mui/material';

const Empty = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      height="50vh"
    >
      <Typography variant="h4" color="textSecondary" gutterBottom>
        No Products Found
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        It seems there are no products to display at the moment.
      </Typography>
      <Link href="/addProduct" style={{ textDecoration: 'none' }}>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px',textTransform:"none" }}
      >
        Add a Product
      </Button>
      </Link>
    </Box>
  );
};

export default Empty;
