import { useEffect, useState } from "react"
import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const { signup, isAuthenticated, error, clearError, loading } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate])


    // Clears errors when component mounts

    useEffect(() => {
        clearError();
        setValidationErrors({});
    }, [formData, clearError])


    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';

        } else if (formData.name.trim().length < 3) {
            errors.name = 'Name must be at least 3 characters';
        }

        if (!formData.email) {
            errors.email = 'Email is required';

        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address'
        }

        if (!formData.password) {
            errors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match'
        }
        return errors;
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setIsSubmitting(true);

        const result = await signup({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password
        });

        if (result.success) {
            navigate('/dashboard');
        }
        setIsSubmitting(false)
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!setShowConfirmPassword);
    }

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, text: '', color: 'bg-gray-200' };

        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;

        if (strength <= 25) return { strength, text: 'weak', color: 'bg-red-400' };
        if (strength <= 50) return { strength, text: 'Fair', color: 'bg-yellow-400' };
        if (strength <= 75) return { strength, text: 'Good', color: 'bg-blue-400' };
        return { strength, text: 'Strong', color: 'bg-green-400' }
    }

}