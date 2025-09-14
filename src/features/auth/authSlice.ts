import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
};

// Sign up async thunk
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/register/', userData);
      const { user, token } = response.data;

      // Save token
      localStorage.setItem('authToken', token);

      // Map API response to AuthState user
      const mappedUser: User = {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
      };

      return { user: mappedUser, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sign up failed');
    }
  }
);

// Sign in async thunk
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user_id, user_email, access_token } = response.data;

      localStorage.setItem('authToken', access_token);

      const user: User = {
        id: user_id.toString(),
        email: user_email,
        name: '', // API doesn’t return name on login
      };

      return { user, token: access_token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sign in failed');
    }
  }
);

// Sign out async thunk
export const signOut = createAsyncThunk('auth/signOut', async () => {
  localStorage.removeItem('authToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign up
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Sign in
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
