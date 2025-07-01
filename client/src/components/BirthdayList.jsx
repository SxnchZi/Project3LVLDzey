import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, CircularProgress, Box, Button, IconButton, Dialog, DialogTitle, DialogContent, Chip } from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { getAllBirthdays, deleteBirthday, getBirthday } from '../api';
import BirthdayForm from './BirthdayForm';

function isToday(date) {
  const d = new Date(date);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
}

function isUpcoming(date) {
  const d = new Date(date);
  const now = new Date();
  const thisYear = now.getFullYear();
  const birthdayThisYear = new Date(thisYear, d.getMonth(), d.getDate());
  let diff = (birthdayThisYear - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) {
    // Если уже прошёл, смотрим на следующий год
    const birthdayNextYear = new Date(thisYear + 1, d.getMonth(), d.getDate());
    diff = (birthdayNextYear - now) / (1000 * 60 * 60 * 24);
  }
  return diff > 0 && diff <= 7;
}

const BirthdayList = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllBirthdays();
      setBirthdays(res.data);
    } catch (err) {
      setError('Ошибка загрузки списка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteBirthday(id);
    fetchData();
  };

  const handleEdit = async (id) => {
    const res = await getBirthday(id);
    setEditData(res.data);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleFormSuccess = () => {
    setOpenForm(false);
    setEditData(null);
    fetchData();
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Список дней рождения</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>Добавить</Button>
      </Box>
      <List>
        {birthdays.map(person => {
          const today = isToday(person.birthDate);
          const upcoming = isUpcoming(person.birthDate);
          return (
            <ListItem
              key={person.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(person.id)}><Edit /></IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(person.id)}><Delete /></IconButton>
                </>
              }
              sx={{
                bgcolor: today ? '#e63946' : upcoming ? '#ffe066' : 'inherit',
                color: today ? '#fff' : 'inherit',
                mb: 1,
                borderRadius: 2,
                boxShadow: today || upcoming ? 2 : 0,
                borderLeft: today ? '8px solid #e63946' : upcoming ? '8px solid #ffe066' : 'none',
              }}
            >
              <ListItemAvatar>
                <Avatar src={person.photoPath ? `http://localhost:5000/${person.photoPath}` : undefined} />
              </ListItemAvatar>
              <ListItemText
                primary={<>
                  {person.fullName}
                  {today && <Chip label="Сегодня!" color="secondary" sx={{ ml: 2, fontWeight: 700 }} />}
                  {!today && upcoming && <Chip label="Скоро!" color="primary" sx={{ ml: 2, fontWeight: 700 }} />}
                </>}
                secondary={`Дата: ${new Date(person.birthDate).toLocaleDateString()}${person.additionalInfo ? ' | ' + person.additionalInfo : ''}`}
              />
            </ListItem>
          );
        })}
      </List>
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>{editData ? 'Редактировать' : 'Добавить'} день рождения</DialogTitle>
        <DialogContent>
          <BirthdayForm initialData={editData} isEdit={!!editData} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BirthdayList; 