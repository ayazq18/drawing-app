import React from 'react';
import { Button, Card, IconButton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './fireBase'; // Adjust the path to your Firebase configuration
import { Icon } from '@iconify/react';
import { styled, keyframes, Box } from '@mui/system';
import { useMediaQuery } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';

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
  const isMobile = useMediaQuery('(max-width:600px)');

  if (isMobile) {
    return null;
  }
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

function NavBar({ userCount }) {
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
        
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="38" height="38">
        <rect x="32" y="48" width="192" height="160" rx="16" ry="16" fill="#f9d423" stroke="#000" stroke-width="6" />
        <line x1="80" y1="48" x2="80" y2="208" stroke="#000" stroke-width="6" stroke-linecap="round" />
        <line x1="176" y1="48" x2="176" y2="208" stroke="#000" stroke-width="6" stroke-linecap="round" />
        <path d="M40 48 q48 -40 176 0" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round" />
        <path d="M40 208 q48 40 176 0" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round" />
      </svg>

        <AnimatedText text="My Drawing Pad" />
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, p: 1, alignItems: 'center', color: 'black', bgcolor: '#a8cbee', boxShadow: '0px 1px 4px #6965db' }}>
        <Typography variant="h6" sx={{ display: { xs: 'none', md: 'block' } }}>Live Users:</Typography>
        <Typography sx={{ p: 1, bgcolor: '#6965db', color: 'white' }}>{userCount}</Typography>
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
