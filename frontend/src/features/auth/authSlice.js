import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { register, login, updateProfile, verifyTutor } from '../../api/api';

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await register(userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await login(credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const response = await updateProfile(profileData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const verifyTutorProfile = createAsyncThunk('auth/verifyTutor', async (_, { rejectWithValue }) => {
  try {
    const response = await verifyTutor();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(verifyTutorProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    if (!token) {
      return rejectWithValue('No token found');
    }
    
    const response = await axios.get('/api/auth/check-auth', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return rejectWithValue(error.response?.data || 'Authentication failed');
  }
});

export const sendPasswordResetEmail = createAsyncThunk(
  'auth/sendPasswordResetEmail',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'An error occurred');
    }
  }
);
export const { logout } = authSlice.actions;
export default authSlice.reducer;