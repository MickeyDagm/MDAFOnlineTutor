import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchTutors } from '../../api/api';

export const fetchTutors = createAsyncThunk('tutors/fetchTutors', async (params, { rejectWithValue }) => {
  try {
    const response = await searchTutors(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const tutorsSlice = createSlice({
  name: 'tutors',
  initialState: {
    tutors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = action.payload;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export default tutorsSlice.reducer;