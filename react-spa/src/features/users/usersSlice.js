import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('https://localhost:5001/admin/users', {withCredentials: true});
    return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
    const response = await axios.post('https://localhost:5001/add_user', newUser, {
        withCredentials: true,
    });
    return response.data;
});


export const updateUser = createAsyncThunk('users/updateUser', async (updatedUser) => {
    const response = await axios.put(`https://localhost:5001/edit_user_by_id`, updatedUser, {
        withCredentials: true,
    });
    return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (user) => {
    await axios.post(`https://localhost:5001/delete_user_by_id`, user,{
        withCredentials: true,
    });
    return user.id;
});


const usersSlice = createSlice({
    name: 'users',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.items.push(action.payload);
                state.status = 'idle';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.items.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.items = state.items.filter(user => user.id !== action.payload);
                state.status = 'idle';
            });
    },
});

export default usersSlice.reducer;