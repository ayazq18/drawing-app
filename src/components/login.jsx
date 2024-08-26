import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./fireBase";
import { Box, Button, TextField, Typography, Container, Alert, Stack, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';


const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      enqueueSnackbar('Login successful!', { variant: 'success' });
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
      enqueueSnackbar('Enter correct credentials!', { variant: 'error' });
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      enqueueSnackbar('Google login successful!', { variant: 'success' });
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
          p: 2,
          borderRadius: 1,
          boxShadow: 3,
          bgcolor: 'background.paper',
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

          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ width: '100%', mt: 1 }}
        >
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Stack direction='row' gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Stack>
        </Box>
        {/* <Button
          type="button"
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button> */}
      </Box>
    </Container>
  );
};

export default Login;
