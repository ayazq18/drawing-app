import React from 'react';
import { Button, Card, IconButton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './fireBase'; // Adjust the path to your Firebase configuration
import { Icon } from '@iconify/react';
import { styled, keyframes, Box } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StaggeredText = styled('div')(({ theme }) => ({
  display: 'inline-block',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: 'white',
  WebkitBackgroundClip: 'text',
  color: '#d0021b',
  '& span': {
    display: 'inline-block',
    opacity: 0,
    animation: `${fadeIn} 0.3s forwards`,
  },
}));

const AnimatedText = ({ text }) => {
  return (
    <StaggeredText>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {char}
        </span>
      ))}
    </StaggeredText>
  );
};

function NavBar({userCount}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <Card
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: '8px',
        boxShadow: '1px 1px 4px #6965db',
        bgcolor: '#f9f9f9'
      }}
    >
      <Stack direction='row' alignItems='center' gap={2}>
        <IconButton sx={{ width: '40px', color: 'white' }}>
          <Icon icon="vscode-icons:file-type-excalidraw" />
        </IconButton>

        <AnimatedText text="My Drawing Pad" />
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap:2, p:1, alignItems: 'center', color:'black',bgcolor:'#a8cbee', boxShadow: '0px 1px 4px #6965db' }}>
        <Typography variant="h6">Live Users:</Typography>
        <Typography sx={{p:1, bgcolor:'#6965db', color:'white' }}>{userCount}</Typography>
      </Box>

      <Button
        onClick={handleLogout}
        variant='contained'
        sx={{
          bgcolor: '#6965db',
          ':hover': {
            bgcolor: '#e64a19',
          },
          color: 'white',
        }}
      >
        <IconButton sx={{ mr: 1, color: 'white' }}>
          <Icon icon="iconamoon:profile-circle-fill" />
        </IconButton>
        Logout
      </Button>
    </Card>
  );
}

export default NavBar;
