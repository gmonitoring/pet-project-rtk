import React, { FC } from 'react';
import { Box } from '@mui/material';
import { Shape } from '../../../services/ShapesService';
import { useShapeStyles } from '../../../hooks/useShapeStyles';

export const Square: FC<Shape> = shape => {
  const shapeStyles = useShapeStyles(shape);

  return (
    <>
      <Box width="100%" pt="100%" sx={shapeStyles} />
    </>
  );
};
