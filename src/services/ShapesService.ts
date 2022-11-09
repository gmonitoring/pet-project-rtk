import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export type Shape = {
  form: string;
  color: string;
  dark: boolean;
};

export type ShapesQuery = Partial<{
  form: Array<string>;
  color: Array<string>;
  dark: boolean;
}>;

export const shapesAPI = createApi({
  reducerPath: 'shapesAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  tagTypes: ['Shape'],
  endpoints: build => ({
    fetchShapes: build.query<Shape[], ShapesQuery>({
      query: (queryArgs = {}) => ({
        url: `/shapes`,
        params: {
          form: queryArgs.form,
          color: queryArgs.color,
          dark: queryArgs.dark,
        },
      }),
      providesTags: result => ['Shape'],
    }),
  }),
});
