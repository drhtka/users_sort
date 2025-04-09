import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Button, 
  CircularProgress, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  TableSortLabel,
  IconButton,
  TextField,
  InputAdornment,
  TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchUsers, deleteUser } from '../api/userApi';
import { UserForm } from './UserForm';
import { DeleteDialog } from './DeleteDialog';
import { User } from '../types/user';

type SortField = 'fullName' | 'email' | 'phone' | 'role';
type SortDirection = 'asc' | 'desc';

export const UserList: React.FC = () => {
  const queryClient = useQueryClient();
  const [editUser, setEditUser] = useState<User | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('fullName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Состояние для пагинации
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

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

  const handleAddUser = () => {
    setEditUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditUser(undefined);
  };

  const handleRequestSort = (field: SortField) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedUsers = React.useMemo(() => {
    const filteredUsers = searchQuery
      ? users.filter(user => 
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : users;

    return [...filteredUsers].sort((a, b) => {
      const compareA = a[sortField];
      const compareB = b[sortField];
      
      if (compareA < compareB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (compareA > compareB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortField, sortDirection, searchQuery]);

  const paginatedUsers = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedUsers.slice(startIndex, endIndex);
  }, [sortedUsers, page, rowsPerPage]);

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField
          label="Поиск"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Добавить пользователя
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === 'fullName'}
                direction={sortField === 'fullName' ? sortDirection : 'asc'}
                onClick={() => handleRequestSort('fullName')}
              >
                ФИО
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'email'}
                direction={sortField === 'email' ? sortDirection : 'asc'}
                onClick={() => handleRequestSort('email')}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'phone'}
                direction={sortField === 'phone' ? sortDirection : 'asc'}
                onClick={() => handleRequestSort('phone')}
              >
                Телефон
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'role'}
                direction={sortField === 'role' ? sortDirection : 'asc'}
                onClick={() => handleRequestSort('role')}
              >
                Роль
              </TableSortLabel>
            </TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.role === 'admin' ? 'Администратор' : 'Пользователь'}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditUser(user)}>Редактировать</Button>
                <Button onClick={() => setDeleteId(user.id)} color="error">Удалить</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editUser ? 'Редактировать пользователя' : 'Добавить пользователя'}</DialogTitle>
        <DialogContent>
          <UserForm user={editUser} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};