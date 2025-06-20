import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

type TFeedsState = {
  isLoading: boolean;
  feedInfo: TOrdersData;
};

const initialState: TFeedsState = {
  isLoading: true,
  feedInfo: {
    orders: [],
    total: 0,
    totalToday: 0
  }
};

export const fetchFeeds = createAsyncThunk(
  'feed/getFeeds',
  async () => (await getFeedsApi()) as TOrdersData
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedSelector: (sliceState) => sliceState.feedInfo
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeeds.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFeeds.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchFeeds.fulfilled, (state, action) => {
      state.isLoading = false;
      state.feedInfo = action.payload;
    });
  }
});

export const { getFeedSelector } = feedSlice.selectors;

export default feedSlice.reducer;
