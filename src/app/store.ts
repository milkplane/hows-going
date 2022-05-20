import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import finding from '../features/finding/findingSlice';

export const store = configureStore({
  reducer: finding
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
