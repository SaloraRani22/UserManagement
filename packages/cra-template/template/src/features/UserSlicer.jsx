import { createSlice } from '@reduxjs/toolkit';
import { fetchUser, updateUser, addUser, deleteUser } from '../api/common-api';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoading: false,
        data: {
            data: [], // Assuming response contains { data: [], total_pages, etc. }
        },
        error: false,
        addSuccess: false,
        updateSuccess: false,
        deleteSuccess: false
    },
    reducers: {
        // Reset success flags after an action
        resetSuccessFlags(state) {
            state.addSuccess = false;
            state.updateSuccess = false;
            state.deleteSuccess = false;
        }
    },
    extraReducers: (builder) => {
        // Fetch Users
        builder.addCase(fetchUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload; // Assuming payload is an object with `data`, `total_pages`, etc.
        });
        builder.addCase(fetchUser.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        });

        // Add User
        builder.addCase(addUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addUser.fulfilled, (state, action) => {
            state.isLoading = false;
        
            // Ensure data structure is initialized
            if (!Array.isArray(state.data.data)) {
                state.data.data = [];
            }
        
            // Add new user to the dataset
            state.data.data.unshift(action.payload);
        
            // Recalculate pagination based on `data` array
            const totalUsers = state.data.data.length;
            const usersPerPage = 6;
            console.log(totalUsers)
            state.data.total_pages = Math.ceil(totalUsers / usersPerPage) + 
            (totalUsers % usersPerPage === 1 && Math.ceil(totalUsers / usersPerPage))-1;
            console.log("total_pages",state.data.total_pages)
            const currentPageUsers = state.data.data.slice(
                (state.data.total_pages - 1) * usersPerPage,
                (state.data.total_pages * usersPerPage)-1
            );
            console.log(...currentPageUsers)
            // Update the visible data on the last page
            state.data.data = [...state.data.data.slice(0, (state.data.total_pages - 2) * usersPerPage), ...currentPageUsers];
            console.log(state.data.data)
            state.addSuccess = true;
        });
        builder.addCase(addUser.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        });

        // Update User
        builder.addCase(updateUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false;
            if (Array.isArray(state.data.data)) {
                const index = state.data.data.findIndex((user) => user.id === action.payload.id);
                if (index !== -1) {
                    state.data.data[index] = { ...state.data.data[index], ...action.payload };
                }
            }
            state.updateSuccess = true;
        });
        builder.addCase(updateUser.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        });

        // Delete User
        builder.addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
            // Filter out the deleted user from the data array
            if (Array.isArray(state.data.data)) {
                state.data.data = state.data.data.filter((user) => user.id !== action.payload);
            }
            state.deleteSuccess = true;
        });
        builder.addCase(deleteUser.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        });
    }
});

// Export actions and reducer
export const { resetSuccessFlags } = userSlice.actions;
export default userSlice.reducer;
