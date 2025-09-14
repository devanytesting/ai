import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export interface JobPost {
  id: number;
  requisition_id: number;
  title: string;
  description: string;
  location: string;
  experience_required: number;
  skills_required: string[];
  salary_range_min: number;
  salary_range_max: number;
  employment_type: string;
  status: string;
  published_portals: string[];
  external_job_ids: Record<string, any>;
  created_by: number;
  created_at: string;
  published_at: string;
  expires_at: string;
}

export interface CreateJobPostData {
  requisition_id: number;
  expires_in_days: number;
}

export interface UpdateJobPostData {
  title?: string;
  description?: string;
  location?: string;
  experience_required?: number;
  skills_required?: string[];
  salary_range_min?: number;
  salary_range_max?: number;
  employment_type?: string;
  status?: string;
}

export interface PublishJobPostData {
  portals: string[];
}

interface JobPostsState {
  jobPosts: JobPost[];
  selectedJobPost: JobPost | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: JobPostsState = {
  jobPosts: [],
  selectedJobPost: null,
  isLoading: false,
  error: null,
};

// Create job post from requisition
export const createJobPost = createAsyncThunk(
  'jobPosts/createJobPost',
  async (jobPostData: CreateJobPostData, { rejectWithValue }) => {
    try {
      const response = await api.post('/job-post/', jobPostData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job post');
    }
  }
);

// Fetch all job posts
export const fetchJobPosts = createAsyncThunk(
  'jobPosts/fetchJobPosts',
  async ({ skip = 0, limit = 100 }: { skip?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/job-post/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job posts');
    }
  }
);

// Fetch single job post by ID
export const fetchJobPostById = createAsyncThunk(
  'jobPosts/fetchJobPostById',
  async (jobPostId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/job-post/${jobPostId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job post');
    }
  }
);

// Update job post
export const updateJobPost = createAsyncThunk(
  'jobPosts/updateJobPost',
  async ({ jobPostId, jobPostData }: { jobPostId: number; jobPostData: UpdateJobPostData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/job-post/${jobPostId}`, jobPostData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job post');
    }
  }
);

// Delete job post
export const deleteJobPost = createAsyncThunk(
  'jobPosts/deleteJobPost',
  async (jobPostId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/job-post/${jobPostId}`);
      return jobPostId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job post');
    }
  }
);

// Publish job post to external portals
export const publishJobPost = createAsyncThunk(
  'jobPosts/publishJobPost',
  async ({ jobPostId, publishData }: { jobPostId: number; publishData: PublishJobPostData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/job-post/${jobPostId}/publish`, publishData);
      return { jobPostId, result: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish job post');
    }
  }
);

// Regenerate job description using AI
export const regenerateJobDescription = createAsyncThunk(
  'jobPosts/regenerateJobDescription',
  async (jobPostId: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/job-post/${jobPostId}/regenerate-description`);
      return { jobPostId, newDescription: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to regenerate job description');
    }
  }
);

const jobPostsSlice = createSlice({
  name: 'jobPosts',
  initialState,
  reducers: {
    setSelectedJobPost: (state, action) => {
      state.selectedJobPost = action.payload;
    },
    clearSelectedJobPost: (state) => {
      state.selectedJobPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create job post cases
      .addCase(createJobPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJobPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobPosts.unshift(action.payload);
      })
      .addCase(createJobPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch job posts cases
      .addCase(fetchJobPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobPosts = action.payload;
      })
      .addCase(fetchJobPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch job post by ID cases
      .addCase(fetchJobPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedJobPost = action.payload;
      })
      .addCase(fetchJobPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update job post cases
      .addCase(updateJobPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJobPost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.jobPosts.findIndex(jobPost => jobPost.id === action.payload.id);
        if (index !== -1) {
          state.jobPosts[index] = action.payload;
        }
        if (state.selectedJobPost?.id === action.payload.id) {
          state.selectedJobPost = action.payload;
        }
      })
      .addCase(updateJobPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete job post cases
      .addCase(deleteJobPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJobPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobPosts = state.jobPosts.filter(jobPost => jobPost.id !== action.payload);
        if (state.selectedJobPost?.id === action.payload) {
          state.selectedJobPost = null;
        }
      })
      .addCase(deleteJobPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Publish job post cases
      .addCase(publishJobPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(publishJobPost.fulfilled, (state, action) => {
        state.isLoading = false;
        const { jobPostId } = action.payload;
        const index = state.jobPosts.findIndex(jobPost => jobPost.id === jobPostId);
        if (index !== -1) {
          state.jobPosts[index].status = 'published';
        }
        if (state.selectedJobPost?.id === jobPostId) {
          state.selectedJobPost.status = 'published';
        }
      })
      .addCase(publishJobPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Regenerate description cases
      .addCase(regenerateJobDescription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(regenerateJobDescription.fulfilled, (state, action) => {
        state.isLoading = false;
        const { jobPostId, newDescription } = action.payload;
        const index = state.jobPosts.findIndex(jobPost => jobPost.id === jobPostId);
        if (index !== -1) {
          state.jobPosts[index].description = newDescription;
        }
        if (state.selectedJobPost?.id === jobPostId) {
          state.selectedJobPost.description = newDescription;
        }
      })
      .addCase(regenerateJobDescription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedJobPost, clearSelectedJobPost, clearError } = jobPostsSlice.actions;
export default jobPostsSlice.reducer;
