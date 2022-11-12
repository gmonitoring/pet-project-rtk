import { ShapesQuery } from 'services/ShapesService';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isShapeShade } from 'utils/typeGuards/shapeShade';

export type Shade = 'all' | 'dark' | 'light';

type ShapeSlice = {
  filters: ShapesQuery;
};

const initialState: ShapeSlice = {
  filters: {},
};

export const shapeSlice = createSlice({
  name: 'shape',
  initialState: initialState,
  reducers: {
    setFilters(state, action: PayloadAction<URLSearchParams>) {
      const result: ShapesQuery = {};
      const serializeQuery = [...action.payload];

      if (serializeQuery) {
        const colorIndex: number = serializeQuery.findIndex(([queryName]) => queryName === 'color');
        const formIndex: number = serializeQuery.findIndex(([queryName]) => queryName === 'form');
        const darkIndex: number = serializeQuery.findIndex(([queryName]) => queryName === 'shade');

        if (colorIndex >= 0) result.color = serializeQuery[colorIndex][1].split(',');
        if (formIndex >= 0) result.form = serializeQuery[formIndex][1].split(',');
        if (darkIndex >= 0) {
          const darkValue: string = serializeQuery[darkIndex][1];

          if (isShapeShade(darkValue)) {
            if (darkValue === 'all') delete result.dark;
            if (darkValue === 'dark') result.dark = true;
            if (darkValue === 'light') result.dark = false;
          }
        }
      }

      state.filters = result;
    },
  },
});

export default shapeSlice.reducer;
