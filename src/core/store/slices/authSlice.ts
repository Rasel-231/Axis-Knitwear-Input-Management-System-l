import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../../types';

/**
 * Holds only the DECODED user profile (id/email/role), never the raw
 * JWT — the actual access/refresh tokens live in HTTP-only cookies and
 * are never touched by client-side JS. This slice exists purely so the
 * UI (Navbar, Sidebar, route guards) knows who's logged in and their role.
 */
type AuthState = {
  user: IUser | null;
};

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
    logoutClient: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logoutClient } = authSlice.actions;
export default authSlice.reducer;
