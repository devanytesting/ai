import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import jobsSlice from '../features/jobs/jobsSlice';
import resumesSlice from '../features/resumes/resumesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    jobs: jobsSlice,
    resumes: resumesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;