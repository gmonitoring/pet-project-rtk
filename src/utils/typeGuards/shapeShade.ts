import { Filters } from "store/reducers/ShapeSlice";

type ShapeShadeKeys = keyof Filters['shade'];
const shapeShades = ['all', 'dark', 'light'];

export const isShapeShade = (value: string): value is ShapeShadeKeys => {
  return shapeShades.includes(value);
};
