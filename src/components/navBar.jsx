import React from 'react';
import { Button, Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './fireBase'; // Adjust the path to your Firebase configuration

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Redirect to the login page after successful logout
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <Card sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h6">My Drawing Pad</Typography>
      <Button onClick={handleLogout}>Logout</Button>
    </Card>
  );
}

export default NavBar;
