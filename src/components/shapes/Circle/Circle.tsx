import React, { FC } from 'react';
import { Box } from '@mui/material';
import { useShapeStyles } from "hooks/useShapeStyles";
import { Shape } from "services/ShapesService";

export const Circle: FC<Shape> = shape => {
  const shapeStyles = useShapeStyles(shape);

  return (
    <>
      <Box width="100%" pt="100%" sx={{ borderRadius: '50%', ...shapeStyles }} />
    </>
  );
};
