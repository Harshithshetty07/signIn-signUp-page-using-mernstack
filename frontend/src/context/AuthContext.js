import React, { createContext, useContext, useReducer, useEffect, } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create Auth context 
const AuthContext = createContext();

// Initial State
const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    error: null
}

// Auth Reducer

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.payload,
            };

        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
}


// Auth Provider Component

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Configure axios defaults
    useEffect(() => {
        if (state.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [state.token])


    // Load user on app start

    useEffect(() => {
        loadUser();
    }, []);

    // Load user

    const loadUser = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }

        try {
            dispatch({ type: 'SET_TOKEN', payload: token });
            const response = await axios.get(`${API_URL}/auth/me`);
            dispatch({ type: 'SET_USER', payload: response.data.user });
        } catch (error) {
            console.error('Load user error:', error);
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' })
        }
    }

    // sign up 

    const signup = async (userData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'CLEAR_ERROR' });

            const response = await axios.post(`${API_URL}/auth/signup`, userData);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.data.user,
                    token: response.data.token
                }
            });
            return { success: true, message: response.data.message };
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || 'Signup failed'
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            return { success: false, message: errorMessage }
        }
    }

    // Sign In 
    const singin = async (crendentials) => {
        try {
            dispatch({
                type: 'SET_LOADING',
                payload: true
            });
            dispatch({
                type: 'CLEAR_ERROR'
            });
            const response = await axios.post(`${API_URL}/auth/signin`, crendentials);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.data.user,
                    token: response.data.token
                }
            });
            return { success: true, message: response.data.message };
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || 'Signin failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            return { success: false, message: errorMessage }
        }
    }

    // Logout 
    const logout = () => {
        dispatch({ type: 'LOGOUT' });

    }

    // Clear Error
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    }

    const value = {
        ...state,
        signup,
        singin,
        logout,
        clearError
    }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}


//
