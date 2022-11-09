import { Palette, useTheme } from '@mui/material/styles';
import { Shape } from '../services/ShapesService';

type UseMyColorsResult = {
  backgroundColor: string;
  WebkitFilter?: string;
};

type paletteShapesKeys = keyof Palette['shapes'];

export const useShapeStyles = (shape: Shape): UseMyColorsResult => {
  const theme = useTheme();
  const styles: UseMyColorsResult = {
    backgroundColor: theme.palette.shapes['default'],
  };
  const color = theme.palette.shapes[shape.color as paletteShapesKeys];

  if (color) styles.backgroundColor = color;
  if (shape.dark) styles['WebkitFilter'] = 'brightness(77%)';

  return styles;
};
