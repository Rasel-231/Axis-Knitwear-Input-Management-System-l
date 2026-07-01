import { baseApi } from '../../../core/store/api/baseApi';
import { IApiResponse, IInput, ICreateInputPayload, InputStatus, InputType } from '../../../types';

type IGetInputsParams = { type?: InputType; status?: InputStatus; page?: number; limit?: number };

export const inputApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInputs: builder.query<IApiResponse<IInput[]>, IGetInputsParams | void>({
      query: (params) => ({ url: '/inputs', method: 'GET', params: params || {} }),
      providesTags: ['Input'],
    }),
    createInput: builder.mutation<IApiResponse<IInput>, ICreateInputPayload>({
      query: (body) => ({ url: '/inputs', method: 'POST', body }),
      // Creating an input changes both the list and the dashboard's WIP
      // aggregate, so invalidate both cache tags.
      invalidatesTags: ['Input', 'Dashboard'],
    }),
    updateInputStatus: builder.mutation<IApiResponse<IInput>, { id: string; status: InputStatus }>({
      query: ({ id, status }) => ({ url: `/inputs/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Input', 'Dashboard'],
    }),
  }),
});

export const { useGetInputsQuery, useCreateInputMutation, useUpdateInputStatusMutation } = inputApi;
