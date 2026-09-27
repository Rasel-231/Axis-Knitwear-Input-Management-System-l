import { baseApi } from '../../../core/store/api/baseApi';
import { IApiResponse, IUser } from '../../../types';

type ILoginPayload = { email: string; password: string };
type ILoginResponse = { accessToken: string; refreshToken: string };
type IRegisterPayload = { name: string; email: string; password: string };

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IApiResponse<ILoginResponse>, ILoginPayload>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: builder.mutation<IApiResponse<IUser>, IRegisterPayload>({
      query: (body) => ({ url: '/users/register', method: 'POST', body }),
    }),
    logout: builder.mutation<IApiResponse<null>, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),

});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
