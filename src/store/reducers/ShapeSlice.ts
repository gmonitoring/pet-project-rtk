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
      const filters: ShapesQuery = {};
      const serializeQuery = [...action.payload];

      const colorIndex: number = serializeQuery.findIndex(([queryName]) => queryName === 'color');
      const formIndex: number = serializeQuery.findIndex(([queryName]) => queryName === 'form');
      const darkIndex: number = serializeQuery.findIndex(([queryName]) => queryName === 'shade');

      if (colorIndex >= 0) filters.color = serializeQuery[colorIndex][1].split(',');
      if (formIndex >= 0) filters.form = serializeQuery[formIndex][1].split(',');
      if (darkIndex >= 0) {
        const darkValue: string = serializeQuery[darkIndex][1];

        if (isShapeShade(darkValue)) {
          if (darkValue === 'all') delete filters.dark;
          if (darkValue === 'dark') filters.dark = true;
          if (darkValue === 'light') filters.dark = false;
        }
      }

      state.filters = filters;
    },
  },
});

export default shapeSlice.reducer;
