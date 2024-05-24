import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
    const response = await axios.get('https://localhost:5001/articles');
    return response.data;
});

export const addArticle = createAsyncThunk('articles/addArticle', async (newArticle) => {
    const response = await axios.post('https://localhost:5001/upload', newArticle, {
        withCredentials: true,
    });
    return response.data;
});

export const updateArticle = createAsyncThunk('articles/updateArticle', async (updatedArticle) => {
    const response = await axios.put(`https://localhost:5001/edit_article_by_id`, updatedArticle, {
        withCredentials: true,
    });
    return response.data;
});

export const deleteArticle = createAsyncThunk('articles/deleteArticle', async (articleId) => {
    await axios.delete(`https://localhost:5001/delete_article_by_id`, {
        withCredentials: true,
        data: articleId
    });
    return articleId;
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
                state.status = 'idle';
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                const index = state.items.findIndex(article => article.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.items = state.items.filter(article => article.id !== action.payload);
            });
    },
});

export default articlesSlice.reducer;