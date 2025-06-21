import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getFeedOrders = createAsyncThunk(
  'getFeedOrders/getFeedsApi',
  getFeedsApi
);

interface IFeedState {
  feeds: TOrder[];
  total: number;
  todayTotal: number;
  isLoading: boolean;
}

const initialState: IFeedState = {
  feeds: [],
  total: 0,
  todayTotal: 0,
  isLoading: false
};

const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    getFeed: (state) => state.feeds,
    getLoading: (state) => state.isLoading,
    getTotal: (state) => state.total,
    getTodayTotal: (state) => state.todayTotal
  },
  extraReducers: (builder) => {
    builder.addCase(getFeedOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFeedOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.feeds = action.payload.orders;
      state.total = action.payload.total;
      state.todayTotal = action.payload.totalToday;
    });
    builder.addCase(getFeedOrders.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { getFeed, getLoading, getTotal, getTodayTotal } =
  feedSlice.selectors;

export const feed = feedSlice.reducer;
