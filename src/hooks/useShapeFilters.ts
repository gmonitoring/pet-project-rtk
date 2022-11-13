import { useAppSelector } from 'hooks/redux';
import { shapeSlice } from 'store/reducers/ShapeSlice';

export const useShapeFilters = () => {
  const { filters } = useAppSelector(state => state.shapesReducer);
  const { setFilters } = shapeSlice.actions;

  return {
    filters,
    setFilters,
  };
};
