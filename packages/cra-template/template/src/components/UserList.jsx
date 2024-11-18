import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { userListColumn } from '../common/ArrayHelper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AlertDialog from '../common/AlertDialog';
import bin from '../assets/trash-bin.png';
import CustomizedDialogs from '../common/CustomizedDialogs';
import UserForm from './UserForm';

export default function UserList({ users, isLoading,setUserDelete,setUserDeleteId }) {
  const [open, setOpen] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null); // New state for selected user
  
  const handleEditClick = (user) => {
    setSelectedUser(user); // Set the selected user
    setOpenPopup(true); // Open the dialog
  };

  const handleDeleteClick =(user) =>{
    console.log(user.id)
    setUserDeleteId(user.id);
    setOpen(true)
  }


  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: `var(--primary-table-header)` }}>
            <TableRow>
              {userListColumn.map((column) => (
                <TableCell
                  sx={{ textAlign: 'center', fontWeight: 'bold' }}
                  key={column.field}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Center the loader over the entire table body
              <TableRow>
                <TableCell
                  colSpan={userListColumn.length}
                  sx={{ textAlign: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id} sx={{ textAlign: 'center', height: 5 }}>
                  {userListColumn.map((column) => {
                    const value = user[column.field];
                    switch (column.type) {
                      case 'img':
                        return (
                          <TableCell
                            key={column.field}
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Avatar
                              sx={{
                                height: { xs: 75, md: 55, lg: 55 },
                                width: { xs: 75, md: 55, lg: 55 },
                              }}
                              alt={user.first_name}
                              src={value}
                            />
                          </TableCell>
                        );
                      case 'text':
                        return (
                          <TableCell key={column.field} sx={{ textAlign: 'center',marginBottom:500 }}>
                            {value}
                          </TableCell>
                        );
                      case 'button':
                        return (
                          <TableCell
                            key={column.field}
                            sx={{ textAlign: 'center', gap: 2, width: 300 }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleEditClick(user)} // Pass the user to the handler
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() =>handleDeleteClick(user)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        );
                      default:
                        return <TableCell key={column.field}></TableCell>;
                    }
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AlertDialog
        question="Are you sure you want to delete the user?"
        info="For your information, the user data will be deleted permanently."
        icon={bin}
        open={open}
        setOpen={setOpen}
        setUserDelete={setUserDelete}
      />
      <CustomizedDialogs
        open={openPopup}
        setOpen={setOpenPopup}
        title="Edit User"
        Content={UserForm}
        contentProps={{ action: 'edit', data: selectedUser,setOpen:setOpenPopup }} // Pass the selected user
      />
    </>
  );
}
