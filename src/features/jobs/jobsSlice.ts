// Jobs slice: requisition CRUD and mapping API -> UI model
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

/**
 * Slice state for jobs list and selection
 */
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

// Fetch jobs: list all requisitions
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

// Create job: post new requisition
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

// Get single job by ID
export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/requisition/${jobId}`);
      const job = response.data;
      // Transform API response to match Job interface
      const transformedJob: Job = {
        id: job.id || jobId,
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
      };
      return transformedJob;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, jobData }: { jobId: string; jobData: CreateJobData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/requisition/${jobId}`, jobData);
      // Transform the response to match our Job interface
      const updatedJob: Job = {
        id: response.data.id || jobId,
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
      return updatedJob;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/requisition/${jobId}`);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

// Post job to social media (example integration)
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
      })
      // Fetch job by ID cases
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update job cases
      .addCase(updateJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.selectedJob?.id === action.payload.id) {
          state.selectedJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete job cases
      .addCase(deleteJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
        if (state.selectedJob?.id === action.payload) {
          state.selectedJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedJob, clearSelectedJob, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;