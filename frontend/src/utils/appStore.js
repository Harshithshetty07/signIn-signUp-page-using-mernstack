import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../utils/authSlice'; // Adjust path to where your authSlice is

const appStore = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default appStore;