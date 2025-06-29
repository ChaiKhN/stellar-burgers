import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | undefined;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: undefined
};

export const getFeedOrders = createAsyncThunk('feed/getAll', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getFeedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeedOrders.rejected, (state, action) => {
        state.loading = false;
        // Исправление: Записываем текст ошибки из action.payload
        state.error = action.payload as string;
      });
  }
});

export const getFeed = (state: RootState) => state.feeds.orders;
export const getTotal = (state: RootState) => state.feeds.total;
export const getTodayTotal = (state: RootState) => state.feeds.totalToday;

export const feed = feedSlice.reducer;
