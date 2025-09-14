import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export interface Job {
  id: string;
  title: string;
  description?: string;
  experience: number;
  location: string;
  skills: string[];
  datePosted?: string;
  department?: string;
  responsibilities?: string;
  qualifications?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  employment_type?: string;
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

export interface ApiJobResponse {
  id?: string;
  title?: string;
  description?: string;
  experience_required?: number;
  location?: string;
  skills_required?: string[];
  responsibilities?: string;
  qualifications?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  employment_type?: string;
  department?: string;
  datePosted?: string;
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
      const response = await api.get('/requisition/');
      // Transform API response to match Job interface
      const jobs: Job[] = response.data.map((job: ApiJobResponse) => ({
        id: job.id || Date.now().toString(),
        title: job.title || 'Untitled Job',
        description: job.description || `${job.responsibilities || ''}\n\nQualifications:\n${job.qualifications || ''}`,
        experience: job.experience_required || 0,
        location: job.location || 'Location not specified',
        skills: job.skills_required || [],
        datePosted: job.datePosted || new Date().toISOString(),
        department: job.department,
        responsibilities: job.responsibilities,
        qualifications: job.qualifications,
        salary_range_min: job.salary_range_min,
        salary_range_max: job.salary_range_max,
        employment_type: job.employment_type,
      }));
      return jobs;
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
        title: response.data.title || jobData.title,
        description: response.data.description || `${jobData.responsibilities}\n\nQualifications:\n${jobData.qualifications}`,
        experience: response.data.experience_required || jobData.experience_required,
        location: response.data.location || jobData.location,
        skills: response.data.skills_required || jobData.skills_required,
        datePosted: response.data.datePosted || new Date().toISOString(),
        department: response.data.department || jobData.department,
        responsibilities: response.data.responsibilities || jobData.responsibilities,
        qualifications: response.data.qualifications || jobData.qualifications,
        salary_range_min: response.data.salary_range_min || jobData.salary_range_min,
        salary_range_max: response.data.salary_range_max || jobData.salary_range_max,
        employment_type: response.data.employment_type || jobData.employment_type,
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