import { baseApi } from '../../../core/store/api/baseApi';
import { IApiResponse, IDashboardSummary } from '../../../types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<IApiResponse<IDashboardSummary>, void>({
      query: () => ({ url: '/dashboard', method: 'GET' }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
