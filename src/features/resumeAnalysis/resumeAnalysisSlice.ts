import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { updateUploadProgress } from '../resumes/resumesSlice';

// Types aligned with Resume Analysis API
export interface ResumeAnalysisItem {
  id: number;
  requisition_id: number;
  candidate_name: string;
  resume_filename: string;
  match_percentage: number;
  confidence_score: number;
  is_match: string;
  skills_match: Record<string, unknown>;
  missing_skills: string[];
  experience_match: boolean;
  gaps_analysis: string;
  suitability_rating: string;
  analysis_details: Record<string, unknown>;
  created_at: string;
}

export interface ResumeAnalysisBulkResponse {
  total_candidates: number;
  matches: number;
  partial_matches: number;
  not_matches: number;
  candidates: ResumeAnalysisItem[];
}

export interface AnalysisSummary {
  total_candidates: number;
  matches: number;
  partial_matches: number;
  not_matches: number;
  average_match_percentage?: number;
  top_candidates?: unknown[];
}

interface ResumeAnalysisState {
  byRequisition: Record<number, ResumeAnalysisItem[]>;
  byId: Record<number, ResumeAnalysisItem>;
  summaryByRequisition: Record<number, AnalysisSummary>;
  lastBulkResponse?: ResumeAnalysisBulkResponse;
  isLoading: boolean;
  error: string | null;
}

const initialState: ResumeAnalysisState = {
  byRequisition: {},
  byId: {},
  summaryByRequisition: {},
  isLoading: false,
  error: null,
};

// Analyze a single resume against a requisition
export const analyzeResumeSingle = createAsyncThunk(
  'resumeAnalysis/analyzeSingle',
  async (
    params: { requisitionId: number; file: File; candidateName?: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { requisitionId, file, candidateName } = params;
      const formData = new FormData();
      formData.append('requisition_id', String(requisitionId));
      const derivedName = file.name.replace(/\.[^/.]+$/, '');
      formData.append('candidate_name', candidateName || derivedName);
      formData.append('resume_file', file);

      // Initialize progress for this file
      dispatch(updateUploadProgress({ fileName: file.name, progress: 0, status: 'uploading' }));

      const response = await api.post('/resume-analysis/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          dispatch(updateUploadProgress({ fileName: file.name, progress, status: 'uploading' }));
        },
      } as any);

      // Mark completed
      dispatch(updateUploadProgress({ fileName: file.name, progress: 100, status: 'completed' }));
      return response.data as ResumeAnalysisItem;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to analyze resume';
      return rejectWithValue(message);
    }
  }
);

// Analyze multiple resumes against a requisition
export const analyzeResumesBulk = createAsyncThunk(
  'resumeAnalysis/analyzeBulk',
  async (
    params: { requisitionId: number; files: File[]; candidateNames?: string[] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { requisitionId, files, candidateNames } = params;

      const formData = new FormData();
      formData.append('requisition_id', String(requisitionId));

      files.forEach((file) => {
        formData.append('resume_files', file);
        // Initialize per-file progress
        dispatch(updateUploadProgress({ fileName: file.name, progress: 0, status: 'uploading' }));
      });

      const derivedNames = files.map((f) => f.name.replace(/\.[^/.]+$/, ''));
      const names = (candidateNames && candidateNames.length === files.length)
        ? candidateNames
        : derivedNames;

      // API expects string; join by comma
      formData.append('candidate_names', names.join(','));

      const response = await api.post('/resume-analysis/analyze-bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          for (const f of files) {
            dispatch(updateUploadProgress({ fileName: f.name, progress, status: 'uploading' }));
          }
        },
      } as any);

      // Mark all as completed
      for (const f of files) {
        dispatch(updateUploadProgress({ fileName: f.name, progress: 100, status: 'completed' }));
      }
      return response.data as ResumeAnalysisBulkResponse;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to analyze resumes';
      return rejectWithValue(message);
    }
  }
);

// Fetch all analyses for a requisition
export const fetchAnalysesByRequisition = createAsyncThunk(
  'resumeAnalysis/fetchByRequisition',
  async (requisitionId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resume-analysis/requisition/${requisitionId}`);
      return { requisitionId, items: response.data as ResumeAnalysisItem[] };
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to fetch analyses';
      return rejectWithValue(message);
    }
  }
);

// Fetch a specific analysis
export const fetchAnalysisById = createAsyncThunk(
  'resumeAnalysis/fetchById',
  async (analysisId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resume-analysis/analysis/${analysisId}`);
      return response.data as ResumeAnalysisItem;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to fetch analysis';
      return rejectWithValue(message);
    }
  }
);

// Delete an analysis
export const deleteAnalysis = createAsyncThunk(
  'resumeAnalysis/delete',
  async (analysisId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/resume-analysis/analysis/${analysisId}`);
      return analysisId;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to delete analysis';
      return rejectWithValue(message);
    }
  }
);

// Get summary for a requisition
export const fetchAnalysisSummary = createAsyncThunk(
  'resumeAnalysis/summary',
  async (requisitionId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resume-analysis/summary/${requisitionId}`);
      return { requisitionId, summary: response.data as AnalysisSummary };
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to fetch summary';
      return rejectWithValue(message);
    }
  }
);

const resumeAnalysisSlice = createSlice({
  name: 'resumeAnalysis',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(analyzeResumeSingle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeResumeSingle.fulfilled, (state, action: PayloadAction<ResumeAnalysisItem>) => {
        state.isLoading = false;
        const item = action.payload;
        state.byId[item.id] = item;
        const list = state.byRequisition[item.requisition_id] || [];
        const existingIndex = list.findIndex((i) => i.id === item.id);
        if (existingIndex >= 0) {
          list[existingIndex] = item;
        } else {
          list.unshift(item);
        }
        state.byRequisition[item.requisition_id] = list;
      })
      .addCase(analyzeResumeSingle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to analyze resume';
      })
      .addCase(analyzeResumesBulk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeResumesBulk.fulfilled, (state, action: PayloadAction<ResumeAnalysisBulkResponse>) => {
        state.isLoading = false;
        state.lastBulkResponse = action.payload;
        const items = action.payload.candidates || [];
        if (items.length > 0) {
          const reqId = items[0].requisition_id;
          state.byRequisition[reqId] = items;
          for (const item of items) {
            state.byId[item.id] = item;
          }
        }
      })
      .addCase(analyzeResumesBulk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to analyze resumes';
      })
      .addCase(fetchAnalysesByRequisition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalysesByRequisition.fulfilled, (state, action) => {
        state.isLoading = false;
        const { requisitionId, items } = action.payload as { requisitionId: number; items: ResumeAnalysisItem[] };
        state.byRequisition[requisitionId] = items;
        for (const item of items) {
          state.byId[item.id] = item;
        }
      })
      .addCase(fetchAnalysesByRequisition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch analyses';
      })
      .addCase(fetchAnalysisById.fulfilled, (state, action) => {
        const item = action.payload as ResumeAnalysisItem;
        state.byId[item.id] = item;
        const list = state.byRequisition[item.requisition_id] || [];
        const existingIndex = list.findIndex((i) => i.id === item.id);
        if (existingIndex >= 0) {
          list[existingIndex] = item;
        } else {
          list.push(item);
        }
        state.byRequisition[item.requisition_id] = list;
      })
      .addCase(deleteAnalysis.fulfilled, (state, action) => {
        const id = action.payload as number;
        const item = state.byId[id];
        if (item) {
          const reqId = item.requisition_id;
          state.byRequisition[reqId] = (state.byRequisition[reqId] || []).filter((i) => i.id !== id);
        }
        delete state.byId[id];
      })
      .addCase(fetchAnalysisSummary.fulfilled, (state, action) => {
        const { requisitionId, summary } = action.payload as { requisitionId: number; summary: AnalysisSummary };
        state.summaryByRequisition[requisitionId] = summary;
      });
  },
});

export default resumeAnalysisSlice.reducer;

