import { user, initialState, setLoginUser } from '../userSlice';

describe('userSlice', () => {
  it('handles setLoginUser.fulfilled', () => {
    const profile = { email: 'user@e.com', name: 'user' };
    const action = {
      type: setLoginUser.fulfilled.type,
      payload: { user: profile }
    };
    const state = user(initialState, action);
    expect(state.profile).toEqual(profile);
    expect(state.isInitUser).toBe(true);
  });

  it('handles setLoginUser.rejected', () => {
    const action = {
      type: setLoginUser.rejected.type,
      error: { message: 'Login failed' }
    };
    const state = user(initialState, action);
    expect(state.error).toBe('Login failed');
  });
});
