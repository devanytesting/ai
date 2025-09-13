import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export interface Job {
  id: string;
  title: string;
  description: string;
  experience: number;
  location: string;
  skills: string[];
  datePosted: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  experience: number;
  location: string;
  skills: string[];
}

interface JobsState {
  jobs: Job[];
  selectedJob: Job | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  isLoading: false,
  error: null,
};

// Fetch jobs async thunk
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      // For demo purposes, return mock data
      // In production, replace with: const response = await api.get('/jobs');
      const { mockJobs } = await import('../../data/mockData');
      return mockJobs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

// Create job async thunk
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: CreateJobData, { rejectWithValue }) => {
    try {
      // For demo purposes, create a mock job with current date
      // In production, replace with: const response = await api.post('/jobs', jobData);
      const newJob: Job = {
        ...jobData,
        id: Date.now().toString(),
        datePosted: new Date().toISOString(),
      };
      return newJob;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

// Post job to social media
export const postJobToSocial = createAsyncThunk(
  'jobs/postToSocial',
  async ({ jobId, platform }: { jobId: string; platform: 'instagram' | 'linkedin' }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jobs/${jobId}/post`, { platform });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to post job');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs cases
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create job cases
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedJob, clearSelectedJob, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;