import { Role } from '../../types';

/**
 * Local-only demo account so the UI can be developed without a running
 * backend. Gated behind NODE_ENV — in production the credentials are
 * undefined and this module becomes a no-op.
 *
 * The session token created here is a JWT-*shaped* string (unsigned), so
 * src/middleware.ts can still read the role for route guarding. It is NOT
 * accepted by the backend, so data requests still need a real account.
 */
const DEMO_EMAIL = 'halifax980@gmail.com';
const DEMO_PASSWORD = 'Asdf1234';
const DEMO_TTL_SECONDS = 60 * 60 * 8;

const isDev = process.env.NODE_ENV === 'development';

export const DEMO_CREDENTIALS = isDev ? { email: DEMO_EMAIL, password: DEMO_PASSWORD } : undefined;

export const isDemoCredentials = (email: string, password: string): boolean =>
  isDev && email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;

export const startDemoSession = (role: Role = Role.ADMIN) => {
  const user = {
    id: 'demo-user-0001',
    name: 'Demo User',
    email: DEMO_EMAIL,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + DEMO_TTL_SECONDS,
    }),
  );

  document.cookie = `accessToken=${header}.${payload}.demo; path=/; max-age=${DEMO_TTL_SECONDS}; SameSite=Lax`;

  return user;
};

/** Keeps the unsigned demo cookie in sync when the dev role switcher changes role. */
export const refreshDemoSession = (role: Role) => {
  if (!isDemoSession()) return;
  startDemoSession(role);
};

/** True when the current accessToken cookie is the unsigned local demo one. */
export const isDemoSession = () =>
  typeof document !== 'undefined' && document.cookie.includes('accessToken=') && document.cookie.includes('.demo');
