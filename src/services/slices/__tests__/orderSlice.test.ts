import { order, initialState, createOrder } from '../orderSlice';

describe('orderSlice', () => {
  it('handles createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: { order: { number: '101' } }
    };
    const state = order(initialState, action);
    expect(state.orderData?.number).toBe('101');
  });

  it('handles createOrder.rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'ERROR' }
    };
    const state = order(initialState, action);
    expect(state.error).toBe('ERROR');
  });
});
