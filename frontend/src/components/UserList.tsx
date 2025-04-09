import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress, Box } from '@mui/material';
import { fetchUsers, deleteUser } from '../api/userApi';
import { UserForm } from './UserForm';
import { DeleteDialog } from './DeleteDialog';
import { User } from '../types/user';

export const UserList: React.FC = () => {
  const queryClient = useQueryClient();
  const [editUser, setEditUser] = useState<User | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Типизация useQuery
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  // Типизация useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <Box sx={{ p: 2 }}>
      <UserForm user={editUser} onClose={() => setEditUser(undefined)} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ФИО</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Телефон</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.role === 'admin' ? 'Администратор' : 'Пользователь'}</TableCell>
              <TableCell>
                <Button onClick={() => setEditUser(user)}>Редактировать</Button>
                <Button onClick={() => setDeleteId(user.id)} color="error">Удалить</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};