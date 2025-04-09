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
  TextField,
  InputAdornment,
  TablePagination,
  useTheme,
  useMediaQuery,
  Paper,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Query hook typing
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  // Mutation hook typing
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
    return [...users].sort((a, b) => {
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
  }, [users, sortField, sortDirection]);

  const paginatedUsers = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedUsers.slice(startIndex, endIndex);
  }, [sortedUsers, page, rowsPerPage]);

  if (isLoading) return <Box display="flex" justifyContent="center" padding={4}><CircularProgress /></Box>;
  if (error) return <Box p={2}><Typography color="error">Error loading data</Typography></Box>;

  // Mobile view with cards
  const mobileView = (
    <Stack spacing={2}>
      {paginatedUsers.map((user) => (
        <Card key={user.id} variant="outlined">
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              {user.fullName}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.phone}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.role === 'admin' ? 'Administrator' : 'User'}
            </Typography>
            <Box mt={1} display="flex" justifyContent="flex-end" gap={1}>
              <IconButton onClick={() => handleEditUser(user)} color="primary" size="small">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => setDeleteId(user.id)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  // Desktop view with table
  const desktopView = (
    <Paper>
      <Table size={isTablet ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === 'fullName'}
                direction={sortField === 'fullName' ? sortDirection : 'asc'}
                onClick={() => handleRequestSort('fullName')}
              >
                Full Name
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
            {!isTablet && (
              <TableCell>
                <TableSortLabel
                  active={sortField === 'phone'}
                  direction={sortField === 'phone' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('phone')}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell>
              <TableSortLabel
                active={sortField === 'role'}
                direction={sortField === 'role' ? sortDirection : 'asc'}
                onClick={() => handleRequestSort('role')}
              >
                Role
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              {!isTablet && <TableCell>{user.phone}</TableCell>}
              <TableCell>{user.role === 'admin' ? 'Administrator' : 'User'}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditUser(user)} color="primary" size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setDeleteId(user.id)} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: isMobile ? 1 : 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0,
          }}
        />
        {isMobile ? mobileView : desktopView}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? '' : 'Rows per page:'}
        />

        {editUser && (
          <Dialog 
            open={isFormOpen} 
            onClose={handleCloseForm}
            maxWidth="sm" 
            fullWidth
            fullScreen={isMobile}
            disableEscapeKeyDown={true}
          >
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
              <UserForm user={editUser} onClose={handleCloseForm} />
            </DialogContent>
          </Dialog>
        )}

        <DeleteDialog
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      </Box>
    </Container>
  );
};