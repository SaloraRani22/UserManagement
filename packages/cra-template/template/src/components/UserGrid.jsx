import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, IconButton, Grid } from '@mui/material';
import pencil from '../assets/pencil.png';
import bin from '../assets/trash-bin.png';
import AlertDialog from '../common/AlertDialog';
import CustomizedDialogs from '../common/CustomizedDialogs';
import CircularProgress from '@mui/material/CircularProgress';
import UserForm from './UserForm';

export default function UserGrid({ users, isLoading,setUserDelete,setUserDeleteId}) {
  const [open, setOpen] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null); // State for selected user

  const handleEditClick = (user) => {
    setSelectedUser(user); // Set the selected user
    setUserDeleteId(user.id);
    setOpenPopup(true); // Open the dialog
  };

  const handleDeleteClick =(user) =>{
    console.log(user.id)
    setUserDeleteId(user.id);
    setOpen(true)
  }


  return (
    <>
      <Box sx={{ padding: 3, backgroundColor: '#dedede', height: { xs: 1650, md: 500, lg: 520 } }}>
        <Grid container spacing={5}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                marginLeft: 107,
                marginTop: 30,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card
                  sx={{
                    position: 'relative',
                    height: 240,
                    width: '100%', // Set width to 100% for better responsiveness
                    overflow: 'hidden',
                    '&:hover .blur-overlay': {
                      backdropFilter: 'blur(4px)',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                    '&:hover .action-icons': {
                      opacity: 1,
                    },
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  <Box
                    className="blur-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                      transition: 'backdrop-filter 0.3s, background-color 0.3s',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: { xs: '57%', md: '60%', lg: '27%' },
                      overflow: 'hidden',
                      zIndex: 2,
                    }}
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 100,
                        height: 100,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ textAlign: 'center', zIndex: 2, marginBottom: 50 }}>
                    <Typography variant="h6">
                      {user.first_name + ' ' + user.last_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.email}
                    </Typography>
                  </CardContent>
                  <Box
                    className="action-icons"
                    sx={{
                      position: 'absolute',
                      bottom: 60,
                      right: { xs: 40, md: 20, lg: 175 },
                      display: 'flex',
                      gap: 1,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      zIndex: 3,
                    }}
                  >
                    <IconButton color="primary" onClick={() => handleEditClick(user)}>
                      <img
                        src={pencil}
                        alt="Edit"
                        style={{
                          width: 70,
                          height: 70,
                          backgroundColor: 'white',
                          borderRadius: 70,
                        }}
                         // Handle edit click
                      />
                    </IconButton>
                    <IconButton color="error" onClick={()=>handleDeleteClick(user)}>
                      <img
                        src={bin}
                        alt="Delete"
                        style={{
                          width: 70,
                          height: 70,
                          backgroundColor: 'white',
                          borderRadius: 70,
                        }}
                      />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
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
        contentProps={{ action: 'edit', data: selectedUser,setOpen:setOpenPopup  }} // Pass the selected user
      />
    </>
  );
}
