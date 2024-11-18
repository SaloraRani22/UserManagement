import * as React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ question, info, open, setOpen, icon, setUserDelete }) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setUserDelete(true);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEnforceFocus // Prevent conflicts with focus management
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: 22, display: 'flex', gap: 2 }}>
          <Box sx={{ marginTop: 4 }}>
            {icon ? (
              <img
                src={icon}
                style={{ width: 45, height: 45, backgroundColor: 'white', borderRadius: 5 }}
                alt="Dialog icon"
              />
            ) : null}
          </Box>
          <Box sx={{ marginTop: 5 }}>{question || ''}</Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ fontSize: 16, marginLeft: 4 }}>
            {info || ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginRight: 1, mb: 2, ml: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
