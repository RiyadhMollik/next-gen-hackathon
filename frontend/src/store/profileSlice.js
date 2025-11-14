import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile/me');
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/me', data);
      return response.data.profile || response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

export const addSkill = createAsyncThunk(
  'profile/addSkill',
  async (skillData, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/skills', skillData);
      return response.data.skill;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add skill');
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'profile/deleteSkill',
  async (skillId, { rejectWithValue }) => {
    try {
      await api.delete(`/profile/skills/${skillId}`);
      return skillId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete skill');
    }
  }
);

export const uploadCVPDF = createAsyncThunk(
  'profile/uploadCVPDF',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const response = await api.post('/cv-analysis/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload and analyze PDF');
    }
  }
);

export const analyzeCVText = createAsyncThunk(
  'profile/analyzeCVText',
  async (cvText, { rejectWithValue }) => {
    try {
      const response = await api.post('/cv-analysis/analyze-text', { cvText });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to analyze CV text');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
    analyzing: false
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        if (state.data) {
          state.data.skills.push(action.payload);
        }
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        if (state.data) {
          state.data.skills = state.data.skills.filter(s => s.id !== action.payload);
        }
      })
      .addCase(uploadCVPDF.pending, (state) => {
        state.analyzing = true;
        state.error = null;
      })
      .addCase(uploadCVPDF.fulfilled, (state, action) => {
        state.analyzing = false;
        state.data = action.payload;
      })
      .addCase(uploadCVPDF.rejected, (state, action) => {
        state.analyzing = false;
        state.error = action.payload;
      })
      .addCase(analyzeCVText.pending, (state) => {
        state.analyzing = true;
        state.error = null;
      })
      .addCase(analyzeCVText.fulfilled, (state, action) => {
        state.analyzing = false;
        state.data = action.payload;
      })
      .addCase(analyzeCVText.rejected, (state, action) => {
        state.analyzing = false;
        state.error = action.payload;
      });
  }
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
