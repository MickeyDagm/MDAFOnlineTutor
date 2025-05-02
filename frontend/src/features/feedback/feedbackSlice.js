import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { submitFeedback } from '../../api/api';

export const submitNewFeedback = createAsyncThunk('feedback/submit', async (feedbackData, { rejectWithValue }) => {
  try {
    const response = await submitFeedback(feedbackData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    feedback: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitNewFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitNewFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedback.push(action.payload);
      })
      .addCase(submitNewFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export default feedbackSlice.reducer;