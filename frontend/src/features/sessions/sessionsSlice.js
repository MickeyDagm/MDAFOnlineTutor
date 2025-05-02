import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleSession, getSessions, cancelSession } from '../../api/api';

export const scheduleNewSession = createAsyncThunk('sessions/schedule', async (sessionData, { rejectWithValue }) => {
  try {
    const response = await scheduleSession(sessionData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchSessions = createAsyncThunk('sessions/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await getSessions();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const cancelExistingSession = createAsyncThunk('sessions/cancel', async (sessionId, { rejectWithValue }) => {
  try {
    const response = await cancelSession(sessionId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: {
    sessions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(scheduleNewSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleNewSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.push(action.payload);
      })
      .addCase(scheduleNewSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(cancelExistingSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.map(session =>
          session._id === action.payload._id ? action.payload : session
        );
      });
  },
});

export default sessionsSlice.reducer;
