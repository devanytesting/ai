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
  department: string;
  location: string;
  experience_required: number;
  skills_required: string[];
  responsibilities: string;
  qualifications: string;
  salary_range_min: number;
  salary_range_max: number;
  employment_type: string;
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
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

// Create job async thunk
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: CreateJobData, { rejectWithValue }) => {
    try {
      // Call the actual API endpoint
      const response = await api.post('/requisition/', jobData);
      
      // Transform the response to match our Job interface
      const newJob: Job = {
        id: response.data.id || Date.now().toString(),
        title: response.data.title,
        description: `${response.data.responsibilities}\n\nQualifications:\n${response.data.qualifications}`,
        experience: response.data.experience_required,
        location: response.data.location,
        skills: response.data.skills_required,
        datePosted: new Date().toISOString(),
      };
      return newJob;
    } catch (error) {
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
    } catch (error) {
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