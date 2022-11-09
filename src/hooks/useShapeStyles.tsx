import { useTheme } from '@mui/material/styles';
import { Shape } from '../services/ShapesService';
import { isPaletteColor } from '../utils/typeGuards/shapeColors';

type UseMyColorsResult = {
  backgroundColor: string;
  WebkitFilter?: string;
};

export const useShapeStyles = (shape: Shape): UseMyColorsResult => {
  const theme = useTheme();
  const styles: UseMyColorsResult = {
    backgroundColor: isPaletteColor(shape.color) ? theme.palette.shapes[shape.color] : theme.palette.shapes['default'],
  };

  if (shape.dark) styles['WebkitFilter'] = 'brightness(77%)';

  return styles;
};
