import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, Button, Checkbox, FormControlLabel, MenuItem, Select, Box } from '@mui/material';
import { createUser, updateUser } from '../api/userApi';
import { User } from '../types/user';

const userSchema = z.object({
  fullName: z.string().min(1, 'ФИО обязательно').max(100),
  email: z.string().email('Неверный email'),
  phone: z.string().min(1, 'Телефон обязателен'),
  birthDate: z.string().optional(),
  role: z.enum(['admin', 'user']),
  position: z.string().max(255).optional(),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onClose: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate || '',
      role: user.role,
      position: user.position || '',
      isActive: user.isActive,
    } : {
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      role: 'user',
      position: '',
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => updateUser(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
  });

  const onSubmit: SubmitHandler<UserFormData> = (data) => {
    console.log('Submitting form with data:', data);
    if (user) {
      console.log('Updating user:', user.id, data);
      updateMutation.mutate(data);
    } else {
      console.log('Creating new user:', data);
      createMutation.mutate(data);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Controller
        name="fullName"
        control={control}
        render={({ field, fieldState }) => (
          <TextField label="ФИО" {...field} error={!!fieldState.error} helperText={fieldState.error?.message} />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <TextField label="Email" {...field} error={!!fieldState.error} helperText={fieldState.error?.message} />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <TextField label="Телефон" {...field} error={!!fieldState.error} helperText={fieldState.error?.message} />
        )}
      />
      <Controller
        name="birthDate"
        control={control}
        render={({ field }) => <TextField type="date" label="Дата рождения" {...field} InputLabelProps={{ shrink: true }} />}
      />
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Select {...field} label="Роль">
            <MenuItem value="admin">Администратор</MenuItem>
            <MenuItem value="user">Пользователь</MenuItem>
          </Select>
        )}
      />
      <Controller
        name="position"
        control={control}
        render={({ field }) => <TextField label="Должность" {...field} />}
      />
      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Активный" />
        )}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained">{user ? 'Сохранить' : 'Добавить'}</Button>
        <Button onClick={onClose} variant="outlined">Отмена</Button>
      </Box>
    </Box>
  );
};