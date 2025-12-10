import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../api/mockData';
import { usersApi } from '../api/usersApi';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await usersApi.login(email, password);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: Omit<User, 'id' | 'createdAt'>) => {
    const user = await usersApi.create(userData);
    return user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('currentUser');
    },
    loadUser: (state) => {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        state.user = JSON.parse(userStr);
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.error = null;
      });
  },
});

export const { logout, loadUser } = authSlice.actions;
export default authSlice.reducer;
