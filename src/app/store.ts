import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import findingFlow from '../features/findingFlow/findingFlowSlice';
import map from '../features/map/mapSlice';

export const store = configureStore({
  reducer: {
    map,
    findingFlow,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
