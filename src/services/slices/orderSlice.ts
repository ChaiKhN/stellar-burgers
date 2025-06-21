import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'createOrder/orderBurgerApi',
  orderBurgerApi
);

export const getUserOrders = createAsyncThunk(
  'getUserOrders/getOrdersApi',
  getOrdersApi
);

export const getOrderByNumberFromApi = createAsyncThunk(
  'getOrderByNumberFromApi/getOrderByNumberApi',
  getOrderByNumberApi
);

interface IOrderState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | undefined;
  request: boolean;
  orderData: TOrder | null;
}

const initialState: IOrderState = {
  orders: [],
  isLoading: false,
  error: undefined,
  request: false,
  orderData: null
};

const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
    }
  },
  selectors: {
    getOrder: (state) => state.orders,
    getOrderDate: (state) => state.orderData,
    getRequest: (state) => state.request,
    getLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder.addCase(getUserOrders.pending, (state) => {
      state.request = true;
    });
    builder.addCase(getUserOrders.fulfilled, (state, action) => {
      state.request = false;
      state.orders = action.payload;
    });
    builder.addCase(getUserOrders.rejected, (state, action) => {
      state.request = false;
      state.error = action.error.message;
    });
    builder.addCase(createOrder.pending, (state) => {
      state.request = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.request = false;
      state.orderData = action.payload.order;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.request = false;
      state.error = action.error.message;
    });

    builder.addCase(getOrderByNumberFromApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderByNumberFromApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
    });
    builder.addCase(getOrderByNumberFromApi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  }
});

export const { getOrder, getOrderDate, getRequest, getLoading } =
  orderSlice.selectors;

export const { clearOrder } = orderSlice.actions;

export const order = orderSlice.reducer;
