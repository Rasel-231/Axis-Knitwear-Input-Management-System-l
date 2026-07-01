export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

// Must match src/socket/index.ts SOCKET_EVENTS on the backend exactly.
export const SOCKET_EVENTS = {
  INPUT_CREATED: 'input:created',
  INPUT_STATUS_UPDATED: 'input:status-updated',
  DASHBOARD_WIP_UPDATED: 'dashboard:wip-updated',
} as const;

export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
} as const;
