import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Input } from '@mui/material';
import { addBirthday, updateBirthday } from '../api';

const BirthdayForm = ({ initialData, onSuccess, isEdit }) => {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate ? initialData.birthDate.slice(0, 10) : '');
  const [additionalInfo, setAdditionalInfo] = useState(initialData?.additionalInfo || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('FullName', fullName);
      formData.append('BirthDate', birthDate);
      formData.append('AdditionalInfo', additionalInfo);
      if (photoFile) formData.append('PhotoFile', photoFile);
      let res;
      if (isEdit && initialData?.id) {
        res = await updateBirthday(initialData.id, formData);
      } else {
        res = await addBirthday(formData);
      }
      setSuccess(true);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      setError('Ошибка сохранения');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={3}>
      <Typography variant="h6" align="center" gutterBottom>
        {isEdit ? 'Редактировать' : 'Добавить'} день рождения
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="ФИО"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Дата рождения"
          type="date"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Дополнительная информация"
          value={additionalInfo}
          onChange={e => setAdditionalInfo(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Input
          type="file"
          onChange={e => setPhotoFile(e.target.files[0])}
          fullWidth
          inputProps={{ accept: 'image/*' }}
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Сохранено!</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {isEdit ? 'Сохранить' : 'Добавить'}
        </Button>
      </form>
    </Box>
  );
};

export default BirthdayForm; 