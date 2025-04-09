import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Вы уверены, что хотите удалить пользователя?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={onConfirm} color="error">Удалить</Button>
      </DialogActions>
    </Dialog>
  );
};