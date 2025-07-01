import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { login } from '../api';

const LoginForm = ({ onLogin }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(userName, password);
      localStorage.setItem('token', res.data.token);
      if (onLogin) onLogin();
    } catch (err) {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h5" align="center" gutterBottom>
        Вход
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Имя пользователя"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Войти
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm; 