import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { makeStyles } from "@material-ui/core/styles";
import ButtonGroup from '@mui/material/ButtonGroup';
import { FaTableCells } from "react-icons/fa6";
import CustomizedDialogs from '../common/CustomizedDialogs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser,deleteUser } from '../api/common-api';
import AlertMessage from '../common/AlertMessage';
// import { resetSuccessFlags } from '../features/UserSlicer';
import { FaList } from "react-icons/fa";
import UserList from "./UserList";
import UserGrid from './UserGrid';
import UserForm from './UserForm';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(0),
    },
    '& .MuiPaginationItem-icon, & .MuiPaginationItem-root': {
      backgroundColor: 'white',
    },
  },
}));

const User = () => {
  const [viewAsTable, setViewAsTable] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const[userDelete, setUserDelete] = React.useState(false);
  const[userDeleteId, setUserDeleteId] = React.useState(null);
  const dispatch = useDispatch();
  const classes = useStyles();
  const perPage = 6;

  const { user: { data: usersList, isLoading } } = useSelector(state => state);
  const users = usersList?.data || [];
  console.log(users)
  // Fetch users only when currentPage or perPage changes
  useEffect(() => {
    dispatch(fetchUser({ page: currentPage, perPage }));
  }, [dispatch, currentPage, perPage]);

  useEffect(() => {
    if (userDelete) {
      console.log('Deleting user with ID:', userDeleteId);

      // Call the delete API using Redux
      dispatch(deleteUser(userDeleteId))
        .unwrap()
        .then(() => {
          AlertMessage(
             "User deletion is successful",
            "success",
            ""
        );
        })
        .catch((error) => {
          AlertMessage(
            "User deletion failed",
           "error",
           error
       );
        })
        .finally(() => {
          // Reset the userDelete flag after API call
          setUserDelete(false);
        });
    }
  }, [userDelete, userDeleteId, dispatch, setUserDelete]);

  // Memoize the filtered users to reduce unnecessary calculations
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      user =>
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [searchQuery, users]);

  
  useEffect(() => {
    setSearchQuery('');
  }, [currentPage]);

  // Memoize the button styles to avoid unnecessary re-renders
  const viewButtons = useMemo(() => [
    <Button
      key="table"
      startIcon={<FaTableCells />}
      onClick={() => setViewAsTable(true)}
      style={{
        color: viewAsTable ? '#1976d2' : '#cccbca',
        border: viewAsTable ? '2px solid #1976d2' : '2px solid #cccbca',
      }}
    >
      Table
    </Button>,
    <Button
      key="card"
      startIcon={<FaList />}
      onClick={() => setViewAsTable(false)}
      style={{
        color: viewAsTable ? '#cccbca' : '#1976d2',
        border: !viewAsTable ? '2px solid #1976d2' : '2px solid #cccbca',
      }}
    >
      Card
    </Button>,
  ], [viewAsTable]);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handlePageChange = useCallback((_, value) => {
    setCurrentPage(value);
  }, []);

  return (
    <Box sx={{ padding: '120px 50px 16px 50px' }}>
      <Paper
        sx={{
          padding: '16px 10px 16px 24px',
          height: viewAsTable ? { xs: 1000, md: 1000, lg: 720 } : { xs: 1850, md: 700, lg: 710 },
        }}
      >
        <Box sx={{ padding: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, height: 50 }}>
            <Box sx={{ fontWeight: 'bold', fontSize: 35 }}>Users</Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <OutlinedInput
                placeholder="Search"
                sx={{ backgroundColor: 'white', height: 45 }}
                value={searchQuery}
                onChange={handleSearchChange}
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ height: 45, fontSize: { xs: 10, md: 12, lg: 22 } }}
                onClick={() => setOpenPopup(true)}
              >
                Create User
              </Button>
            </Box>
          </Box>
          <ButtonGroup size="small" aria-label="View toggle button group">
            {viewButtons}
          </ButtonGroup>
          {viewAsTable ? (
            <UserList users={filteredUsers} isLoading={isLoading} setUserDelete={setUserDelete} setUserDeleteId={setUserDeleteId}/>
          ) : (
            <UserGrid users={filteredUsers} isLoading={isLoading} setUserDelete={setUserDelete} setUserDeleteId={setUserDeleteId}/>
          )}
        </Box>
        <CustomizedDialogs
          open={openPopup}
          setOpen={setOpenPopup}
          title="Create User"
          Content={UserForm}
          contentProps={{ action:'create',setOpen:setOpenPopup}}
        />
      </Paper>
      <Box className={classes.root} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Pagination
          count={usersList?.total_pages || 0}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default User;