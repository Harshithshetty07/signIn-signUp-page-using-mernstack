import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const token = localStorage.getItem('token');

// Initial State
const initialState = {
    user: null,
    token: token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
};

// Configure axios defaults
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Load User
export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return rejectWithValue('No token found');
        }

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL}/auth/me`);
            return response.data.user;
        } catch (error) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            return rejectWithValue(error.response?.data?.message || 'Failed to load user');
        }
    }
);

// Sign Up
export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, userData);

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);

            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            return {
                user: response.data.user,
                token: response.data.token,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signup failed');
        }
    }
);

// Sign In
export const signin = createAsyncThunk(
    'auth/signin',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signin`, credentials);

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);

            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            return {
                user: response.data.user,
                token: response.data.token,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signin failed');
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            // Optional: call backend logout endpoint
            await axios.post(`${API_URL}/auth/logout`);
        } catch (error) {
            // Continue with logout even if backend call fails
            console.error('Logout error:', error);
        } finally {
            // Always clean up locally
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
        return null;
    }
);

// Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Load User
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            })

            // Sign Up
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            })

            // Sign In
            .addCase(signin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(signin.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = null;
            });
    },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;