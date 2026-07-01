import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../lib/constants';

/**
 * Single RTK Query root. Every module's api file (auth/api, input/api,
 * dashboard/api) calls `baseApi.injectEndpoints()` instead of creating
 * its own createApi — this keeps one shared cache, one middleware, and
 * lets tagInvalidation work across module boundaries (e.g. an input
 * status update invalidating the dashboard's WIP cache tag).
 *
 * credentials: 'include' is required — auth is HTTP-only cookie based,
 * so the browser must send cookies on every request.
 */
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Input', 'Dashboard', 'User'],
  endpoints: () => ({}),
});
