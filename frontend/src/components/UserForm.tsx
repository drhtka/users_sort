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
  CircularProgress
} from '@mui/material';
import { updateUser } from '../api/userApi';
import { User } from '../types/user';

const userSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name should not exceed 100 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  birthDate: z.string().optional(),
  role: z.enum(['admin', 'user']),
  position: z.string()
    .max(255, 'Position should not exceed 255 characters')
    .optional()
    .transform(val => val === '' ? undefined : val),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user: User;
  onClose: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { control, handleSubmit } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate || '',
      role: user.role,
      position: user.position || '',
      isActive: user.isActive,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => updateUser(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
  });

  const onSubmit: SubmitHandler<UserFormData> = (data) => {
    console.log('Updating user:', user.id, data);
    updateMutation.mutate(data);
  };

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
          render={({ field }) => (
            <Select 
              {...field} 
              label="Role"
              fullWidth
              size={isMobile ? "small" : "medium"}
            >
              <MenuItem value="admin">Administrator</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
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
            disabled={updateMutation.isPending}
            startIcon={updateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            onClick={onClose} 
            variant="outlined"
            fullWidth={isMobile}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};