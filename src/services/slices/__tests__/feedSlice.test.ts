import { TOrder } from '@utils-types';
import { feed, getFeedOrders } from '../feedSlice';

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: undefined
  };

  const mockOrders: TOrder[] = [
    { _id: '1', status: 'done', name: 'Order 1', number: 1, createdAt: '', updatedAt: '', ingredients: [] },
    { _id: '2', status: 'done', name: 'Order 2', number: 2, createdAt: '', updatedAt: '', ingredients: [] }
  ];

  it('handles getFeedOrders.pending', () => {
    const action = { type: getFeedOrders.pending.type };
    const state = feed(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('handles getFeedOrders.fulfilled', () => {
    const action = {
      type: getFeedOrders.fulfilled.type,
      payload: { orders: mockOrders, total: 2, totalToday: 1 }
    };
    const state = feed(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(2);
    expect(state.totalToday).toBe(1);
  });

  it('handles getFeedOrders.rejected', () => {
    const errorMessage = 'Failed to fetch orders';
    // Исправлено: передаем ошибку в payload, как это делает createAsyncThunk
    const action = {
      type: getFeedOrders.rejected.type,
      payload: errorMessage
    };
    const state = feed(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage); // Проверяем соответствие
  });
});
