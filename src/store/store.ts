import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { shapesAPI } from 'services/ShapesService';
import shapesReducer from 'store/reducers/ShapeSlice';

const rootReducer = combineReducers({
  [shapesAPI.reducerPath]: shapesAPI.reducer,
  shapesReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoreActions: true,
        },
      }).concat(shapesAPI.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
