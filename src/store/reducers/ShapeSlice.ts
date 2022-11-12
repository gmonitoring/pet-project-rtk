import { ShapesQuery } from "services/ShapesService";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isShapeShade } from "utils/typeGuards/shapeShade";

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
      const serializeQuery = [...action.payload];
      state.filters = {};

      if (serializeQuery.length) {
        serializeQuery.forEach(([queryKey, queryValue]) => {
          if (queryKey === 'shade' && isShapeShade(queryValue)) {
            state.filters.shade = queryValue;
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

      if (state.filters.color) result.color = Object.entries(state.filters.color).map(([color]) => color);
      if (state.filters.form) result.form = Object.entries(state.filters.form).map(([form]) => form);

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
