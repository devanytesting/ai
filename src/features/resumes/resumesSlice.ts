// Resumes slice: uploads with progress and matched resumes
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export interface Resume {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  matchScore?: number;
  status: 'uploaded' | 'processing' | 'matched';
}

/**
 * Per-file upload progress model for UI feedback
 */
export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

/**
 * Slice state for resume uploads and matched results
 */
interface ResumesState {
  resumes: Resume[];
  matchedResumes: Resume[];
  uploadProgress: UploadProgress[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ResumesState = {
  resumes: [],
  matchedResumes: [],
  uploadProgress: [],
  isLoading: false,
  error: null,
};

// Upload resumes: report per-file progress
export const uploadResumes = createAsyncThunk(
  'resumes/uploadResumes',
  async (files: File[], { dispatch, rejectWithValue }) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('resume', file);

        // Initialize progress
        dispatch(updateUploadProgress({
          fileName: file.name,
          progress: 0,
          status: 'uploading'
        }));

        const response = await api.post('/resumes/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            dispatch(updateUploadProgress({
              fileName: file.name,
              progress,
              status: 'uploading'
            }));
          },
        });

        dispatch(updateUploadProgress({
          fileName: file.name,
          progress: 100,
          status: 'completed'
        }));

        return response.data;
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload resumes');
    }
  }
);

// Fetch matched resumes for a job
export const fetchMatchedResumes = createAsyncThunk(
  'resumes/fetchMatched',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/requisition/${jobId}/matched-resumes`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch matched resumes');
    }
  }
);

const resumesSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    updateUploadProgress: (state, action) => {
      const { fileName, progress, status } = action.payload;
      const existingIndex = state.uploadProgress.findIndex(p => p.fileName === fileName);
      
      if (existingIndex >= 0) {
        state.uploadProgress[existingIndex] = { fileName, progress, status };
      } else {
        state.uploadProgress.push({ fileName, progress, status });
      }
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload resumes cases
      .addCase(uploadResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes.push(...action.payload);
      })
      .addCase(uploadResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch matched resumes cases
      .addCase(fetchMatchedResumes.fulfilled, (state, action) => {
        state.matchedResumes = action.payload;
      });
  },
});

export const { updateUploadProgress, clearUploadProgress, clearError } = resumesSlice.actions;
export default resumesSlice.reducer;