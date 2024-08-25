import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './fireBase';
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate()
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setSuccess("Registration successful! You can now log in.");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '400px',
                margin: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
                borderRadius: '8px',
                boxShadow: 3,
            }}
        >
            <Typography variant="h5" sx={{ mb: 2 }}>Register</Typography>
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
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/login')}

                    >
                        Login
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default Register;
