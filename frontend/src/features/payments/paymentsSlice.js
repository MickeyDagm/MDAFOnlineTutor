import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { processPayment, processSignupPayment } from '../../api/api';

export const makePayment = createAsyncThunk(
  'payments/makePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { isSignup, ...data } = paymentData;
      const response = isSignup ? await processSignupPayment(data) : await processPayment(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Payment failed');
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makePayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentsSlice.reducer;