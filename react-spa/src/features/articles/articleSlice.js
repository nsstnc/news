import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
  const response = await axios.get('https://localhost:5001/articles');
  return response.data;
});

export const addArticle = createAsyncThunk('articles/addArticle', async (newArticle) => {
  const response = await axios.post('https://localhost:5001/articles', newArticle);
  return response.data;
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addArticle.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default articlesSlice.reducer;