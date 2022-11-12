import { Shade } from 'store/reducers/ShapeSlice';

const shapeShades = ['all', 'dark', 'light'];

export const isShapeShade = (value: string): value is Shade => {
  return shapeShades.includes(value);
};
