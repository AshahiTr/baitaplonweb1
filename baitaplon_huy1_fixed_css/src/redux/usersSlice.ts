import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabaseClient';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'reader';
  quota: number;
  currentBorrowing: number;
  penaltyStatus: string;
}

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

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data.map((user: any) => ({
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    phone: user.phone,
    role: user.role,
    quota: user.quota,
    currentBorrowing: user.current_borrowing,
    penaltyStatus: user.penalty_status,
  }));
});

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, updates }: { id: string; updates: Partial<User> }) => {
    // Chuyển đổi camelCase sang snake_case cho database
    const dbUpdates: any = {};
    
    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.quota !== undefined) dbUpdates.quota = updates.quota;
    if (updates.currentBorrowing !== undefined) dbUpdates.current_borrowing = updates.currentBorrowing;
    if (updates.penaltyStatus !== undefined) dbUpdates.penalty_status = updates.penaltyStatus;

    console.log('Updating user:', id, 'with:', dbUpdates);

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    console.log('Update successful:', data);

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      role: data.role,
      quota: data.quota,
      currentBorrowing: data.current_borrowing,
      penaltyStatus: data.penalty_status,
    };
  }
);

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string) => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        console.error('Update user rejected:', action.error);
        state.error = action.error.message || 'Failed to update user';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;