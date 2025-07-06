"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, User, Mail } from 'lucide-react';
import { getAuthToken, getUserId } from '../utils/auth';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const SetupPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: []
    });
    const language = localStorage.getItem('lang');

    useEffect(() => {
        // Check if user is already authenticated
        const token = getAuthToken();
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetch user data to pre-fill the form
        const fetchUserData = async () => {
            try {
                const userId = getUserId();
                const response = await fetch(`https://stylish-basket-710b77de8f.strapiapp.com/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setFormData(prev => ({
                        ...prev,
                        username: userData.username || '',
                        email: userData.email || ''
                    }));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const validatePassword = (password) => {
        const feedback = [];
        let score = 0;

        if (password.length >= 8) {
            score += 1;
        } else {
            feedback.push('At least 8 characters');
        }

        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('At least one lowercase letter');
        }

        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('At least one uppercase letter');
        }

        if (/[0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('At least one number');
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('At least one special character');
        }

        return { score, feedback };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            setPasswordStrength(validatePassword(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate passwords match
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            // Validate password strength
            if (passwordStrength.score < 3) {
                toast.error('Password is too weak. Please improve it.');
                return;
            }

            const userId = getUserId();
            const token = getAuthToken();

            const response = await fetch(`https://stylish-basket-710b77de8f.strapiapp.com/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                toast.success('Password setup completed successfully!');
                navigate('/controll');
            } else {
                const errorData = await response.json();
                toast.error(errorData.error?.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('An error occurred while updating your password');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength.score <= 1) return 'bg-red-500';
        if (passwordStrength.score <= 2) return 'bg-orange-500';
        if (passwordStrength.score <= 3) return 'bg-yellow-500';
        if (passwordStrength.score <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Your Password</h1>
                    <p className="text-gray-600">Complete your account setup by creating a secure password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        {/* Password strength indicator */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex space-x-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-2 flex-1 rounded ${
                                                level <= passwordStrength.score ? getPasswordStrengthColor() : 'bg-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {passwordStrength.feedback.length > 0 && (
                                        <ul className="list-disc list-inside">
                                            {passwordStrength.feedback.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Setting up...' : 'Complete Setup'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetupPassword; 