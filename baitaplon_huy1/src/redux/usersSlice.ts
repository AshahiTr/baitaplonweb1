import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../api/mockData';
import { usersApi } from '../api/usersApi';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  return await usersApi.getAll();
});

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, updates }: { id: string; updates: Partial<User> }) => {
    return await usersApi.update(id, updates);
  }
);

export const deleteUser = createAsyncThunk('users/delete', async (id: string) => {
  await usersApi.delete(id);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
