import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { register } from '../api';

const RegisterForm = ({ onRegister }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await register(userName, email, password);
      setSuccess(true);
      if (onRegister) onRegister();
    } catch (err) {
      setError('Ошибка регистрации или пользователь уже существует');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h5" align="center" gutterBottom>
        Регистрация
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
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
        {success && <Alert severity="success">Регистрация успешна!</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Зарегистрироваться
        </Button>
      </form>
    </Box>
  );
};

export default RegisterForm; 