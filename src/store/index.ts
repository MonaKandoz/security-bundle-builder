import { configureStore } from '@reduxjs/toolkit';
import builderReducer from './slices/builderSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    builder: builderReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
