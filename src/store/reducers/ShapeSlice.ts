import { ShapesQuery } from '../../services/ShapesService';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Filters = {
  color?: Record<string, boolean>;
  form?: Record<string, boolean>;
  shade?: 'all' | 'dark' | 'light';
};

type ShapeSlice = {
  filters: Filters;
  parsedFilters: ShapesQuery;
};

const initialState: ShapeSlice = {
  filters: {},
  parsedFilters: {},
};

export const shapeSlice = createSlice({
  name: 'shape',
  initialState: initialState,
  reducers: {
    setFilters(state, action: PayloadAction<URLSearchParams>) {
      const serializeQuery = Object.fromEntries([...action.payload]);
      state.filters = {};

      if (Object.entries(serializeQuery).length) {
        Object.entries(serializeQuery).forEach(([queryKey, queryValue]) => {
          if (queryKey === 'shade') {
            state.filters.shade = queryValue as Filters['shade'];
          }
          if (queryKey === 'color') {
            state.filters.color = {};

            queryValue.split(',').forEach(queryValueItem => {
              if (state.filters.color) {
                state.filters.color[queryValueItem] = true;
              }
            });
          }
          if (queryKey === 'form') {
            state.filters.form = {};

            queryValue.split(',').forEach(queryValueItem => {
              if (state.filters.form) {
                state.filters.form[queryValueItem] = true;
              }
            });
          }
        });
      }
    },

    setParsedFilters(state, _action: PayloadAction<string>) {
      const result: ShapesQuery = {};

      if (state.filters.color) {
        result.color = [];
        Object.entries(state.filters.color).forEach(i => {
          result.color?.push(i[0]);
        });
      }

      if (state.filters.form) {
        result.form = [];
        Object.entries(state.filters.form).forEach(i => {
          result.form?.push(i[0]);
        });
      }

      if (state.filters.shade) {
        if (state.filters.shade === 'all') delete result.dark;
        if (state.filters.shade === 'dark') result.dark = true;
        if (state.filters.shade === 'light') result.dark = false;
      }

      state.parsedFilters = result;
    },
  },
});

export default shapeSlice.reducer;
