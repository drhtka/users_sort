import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  MenuItem, 
  Select, 
  Box, 
  Container,
  useMediaQuery,
  useTheme,
  CircularProgress,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { updateUser, createUser } from '../api/userApi';
import { User } from '../types/user';

const userSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name should not exceed 100 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  birthDate: z.string().optional(),
  role: z.enum(['admin', 'user']),
  position: z.string()
    .min(1, 'Position is required') // Минимальная длина строки
    .max(255, 'Position should not exceed 255 characters') // Максимальная длина строки
    .optional()
    .transform(val => val === '' ? undefined : val),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onClose: () => void;
  isNew?: boolean;
}

const defaultValues: UserFormData = {
  fullName: '',
  email: '',
  phone: '',
  birthDate: '',
  role: 'user',
  position: '',
  isActive: true,
};

export const UserForm: React.FC<UserFormProps> = ({ user, onClose, isNew = false }) => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { control, handleSubmit } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: isNew 
      ? defaultValues 
      : {
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        birthDate: user?.birthDate || '',
        role: user?.role || 'user',
        position: user?.position || '',
        isActive: user?.isActive ?? true,
      },
  });

  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setTimeout(() => {
        onClose();
      }, 100);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => updateUser(user?.id || 0, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setTimeout(() => {
        onClose();
      }, 100);
    },
  });

  const onSubmit: SubmitHandler<UserFormData> = (data) => {
    if (isNew) {
      console.log('Creating user:', data);
      createMutation.mutate(data);
    } else {
      console.log('Updating user:', user?.id, data);
      updateMutation.mutate(data);
    }
  };

  const isPending = isNew ? createMutation.isPending : updateMutation.isPending;

  return (
    <Container maxWidth="sm" disableGutters={isMobile}>
      <Box 
        component="form" 
        onSubmit={handleSubmit(onSubmit)} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          width: '100%',
          padding: isMobile ? 1 : 2 
        }}
      >
        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <TextField 
              label="Full Name" 
              {...field} 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField 
              label="Email" 
              {...field} 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <TextField 
              label="Phone" 
              {...field} 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
          )}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <TextField 
              type="date" 
              label="Birth Date" 
              {...field} 
              InputLabelProps={{ shrink: true }}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
          )}
        />
        <Controller
          name="role"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth error={!!fieldState.error} size={isMobile ? "small" : "medium"}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select 
                {...field} 
                labelId="role-label"
                label="Role"
              >
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          name="position"
          control={control}
          render={({ field, fieldState }) => (
            <TextField 
              label="Position" 
              {...field} 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
              inputProps={{ maxLength: 255 }}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
          )}
        />
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormControlLabel 
              control={<Checkbox {...field} checked={field.value} />} 
              label="Active" 
            />
          )}
        />
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          justifyContent: isMobile ? 'center' : 'flex-end', 
          flexDirection: isMobile ? 'column' : 'row',
          mt: 1
        }}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth={isMobile}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isPending ? 'Saving...' : (isNew ? 'Create' : 'Save')}
          </Button>
          <Button 
            onClick={onClose} 
            variant="outlined"
            fullWidth={isMobile}
            disabled={isPending}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};