import store, { rootReducer } from '../../store';

describe('rootReducer', () => {
  it('should return initial state', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(store.getState());
  });
});
