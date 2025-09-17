import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import jobsSlice from '../features/jobs/jobsSlice';
import resumesSlice from '../features/resumes/resumesSlice';
import jobPostsSlice from '../features/jobPosts/jobPostsSlice';
import resumeAnalysisSlice from '../features/resumeAnalysis/resumeAnalysisSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'jobs', 'resumes', 'jobPosts', 'resumeAnalysis'], // Persist all slices
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  jobs: jobsSlice,
  resumes: resumesSlice,
  jobPosts: jobPostsSlice,
  resumeAnalysis: resumeAnalysisSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;