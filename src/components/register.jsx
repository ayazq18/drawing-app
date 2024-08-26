import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './fireBase';
import { Box, Button, TextField, Typography, Alert, Stack, IconButton, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate()
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            enqueueSnackbar('Passwords do not match!', { variant: 'error' });
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setSuccess("Registration successful! You can now log in.");
            enqueueSnackbar('Registration successful! You can now log in.', { variant: 'success' });
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
                <Stack direction='row' alignItems='center' gap={2} mb={2}>
                    <IconButton sx={{ width: '40px', color: 'white' }}>
                        <Icon icon="vscode-icons:file-type-excalidraw" />
                    </IconButton>
                    <Typography variant="h5" sx={{}}>Register</Typography>
                </Stack>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <form onSubmit={handleRegister} style={{ width: '100%' }}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <Stack direction='row' gap={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Register
                        </Button>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => navigate('/login')}

                        >
                            Login
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Container>
    );
};

export default Register;
