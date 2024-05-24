// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './features/articles/articleSlice';
import usersReducer from './features/users/usersSlice';

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    users: usersReducer,
  },
});

export default store;
