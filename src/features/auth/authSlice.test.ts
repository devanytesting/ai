import reducer, { clearError, signIn, signOut, signUp } from './authSlice';
import { api } from '../../api/client';

jest.mock('../../api/client', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('authSlice', () => {
  it('should return initial state on unknown action', () => {
    const state = reducer(undefined, { type: 'unknown' } as any);
    expect(state.isAuthenticated === !!state.token).toBe(true);
  });

  it('clearError should reset error', () => {
    const prev = reducer(undefined, { type: 'unknown' } as any);
    const next = reducer({ ...prev, error: 'x' }, clearError());
    expect(next.error).toBeNull();
  });

  it('signIn fulfilled sets user and token', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { user_id: '1', user_email: 'a@b.com', access_token: 'tok' },
    });
    const dispatch = jest.fn();
    const getState = jest.fn();
    const action = await (signIn as any)({ email: 'a@b.com', password: 'p' })(dispatch, getState, undefined);
    const state = reducer(undefined, { type: signIn.fulfilled.type, payload: action.payload });
    expect(state.token).toBe('tok');
    expect(state.isAuthenticated).toBe(true);
  });

  it('signUp fulfilled sets user and token', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 2, email: 'c@d.com', name: 'C' }, token: 'tok2' },
    });
    const dispatch = jest.fn();
    const getState = jest.fn();
    const action = await (signUp as any)({ name: 'C', email: 'c@d.com', password: 'x' })(dispatch, getState, undefined);
    const state = reducer(undefined, { type: signUp.fulfilled.type, payload: action.payload });
    expect(state.token).toBe('tok2');
    expect(state.user?.email).toBe('c@d.com');
  });

  it('signOut fulfilled clears auth', () => {
    const prev: any = { user: { id: '1' }, token: 't', isAuthenticated: true, isLoading: false, error: null };
    const next = reducer(prev, { type: signOut.fulfilled.type });
    expect(next.token).toBeNull();
    expect(next.isAuthenticated).toBe(false);
  });
});
