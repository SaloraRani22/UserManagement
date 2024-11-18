import {createAsyncThunk } from '@reduxjs/toolkit';
import api from "../api/http-common";

// Fetch Users (GET Request)
export const fetchUser = createAsyncThunk("fetchUser", async ({ page, perPage }) => {
    const response = await api.get(`users?page=${page}&per_page=${perPage}`);
    return response.data;
});

// Add User (POST Request)
export const addUser = createAsyncThunk("addUser", async (userData) => {
    console.log(userData)
    const response = await api.post('users', userData);
    return response.data;
});

// Update User (PUT Request)
export const updateUser = createAsyncThunk("updateUser", async ({id, userData}) => {
    console.log(id,userData)
    const response = await api.put(`users/${id}`, userData);
    console.log(response)
    return response.data;
});

// Delete User (DELETE Request)
export const deleteUser = createAsyncThunk("deleteUser", async (id) => {
    await api.delete(`users/${id}`);
    return id;
});