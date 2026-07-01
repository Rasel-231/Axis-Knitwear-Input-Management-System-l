import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { setUser, logoutClient } from '../core/store/slices/authSlice';
import { Role, IUser } from '../types';

/**
 * Thin convenience wrapper around the auth slice, used by components/
 * route guards instead of reaching into Redux directly.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === Role.ADMIN,
    setUser: (u: IUser | null) => dispatch(setUser(u)),
    logout: () => dispatch(logoutClient()),
  };
}
