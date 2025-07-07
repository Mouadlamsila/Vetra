import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function GoogleCallback() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState(t('processingLogin'));

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const idToken = urlParams.get("id_token");
                const accessToken = urlParams.get("access_token");
                const error = urlParams.get("error");
                if (error) {
                    setStatus('error');
                    setMessage(t('loginFailed'));
                    setTimeout(() => navigate("/login?error=" + error), 2000);
                    return;
                }
                if (!idToken || !accessToken) {
                    setStatus('error');
                    setMessage(t('noTokenReceived'));
                    setTimeout(() => navigate("/login?error=no_token"), 2000);
                    return;
                }
                // Extract user data from Google token
                const tokenParts = idToken.split('.');
                if (tokenParts.length !== 3) {
                    throw new Error("Token Google invalide");
                }
                const payload = JSON.parse(atob(tokenParts[1]));
                const userEmail = payload.email;
                const baseUsername = userEmail.split('@')[0];
                // Generate a secure password for Google users
                const securePassword = Math.random().toString(36).slice(-12) + '!A1a';
                let strapiJWT = null;
                let userData = null;
                let isNewUser = false;
                // 1. Try to register the user
                try {
                    const uniqueUsername = `${baseUsername}_${Date.now()}_${Math.random().toString(36).slice(-5)}`;
                    const registerResponse = await axios.post(
                        'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local/register',
                        {
                            username: uniqueUsername,
                            email: userEmail,
                            password: securePassword
                        }
                    );
                    strapiJWT = registerResponse.data.jwt;
                    userData = registerResponse.data.user;
                    isNewUser = true;
                } catch (registerError) {
                    // 2. If email exists, try to log in the user
                    const errorData = registerError.response?.data?.error;
                    if (errorData?.message?.includes('email') || errorData?.message?.includes('Email')) {
                        try {
                            // Try to login with a special endpoint (Strapi social login or custom backend)
                            // Here, we use the Strapi Google provider endpoint
                            const loginResponse = await axios.get(
                                `https://stylish-basket-710b77de8f.strapiapp.com/api/auth/google/callback?access_token=${accessToken}`
                            );
                            strapiJWT = loginResponse.data.jwt;
                            userData = loginResponse.data.user;
                            isNewUser = false;
                        } catch (loginError) {
                            setStatus('error');
                            setMessage(t('loginFailed'));
                            setTimeout(() => navigate("/login?error=google_login_failed"), 2000);
                            return;
                        }
                    } else {
                        throw registerError;
                    }
                }
                if (!strapiJWT || !userData) {
                    throw new Error("Impossible d'obtenir les données d'authentification");
                }
                // Store authentication data
                localStorage.setItem("token", strapiJWT);
                localStorage.setItem("user", JSON.stringify(userData.documentId || userData.id));
                localStorage.setItem("IDUser", userData.id);
                localStorage.setItem("role", "user");
                localStorage.setItem("userEmail", userEmail);
                localStorage.setItem("userName", userData.username);
                // Check if this is a new Google user (needs password setup)
                const authIntent = localStorage.getItem('auth_intent');
                localStorage.removeItem('auth_intent');
                setStatus('success');
                setMessage(t('loginSuccess'));
                setTimeout(() => {
                    if (isNewUser && authIntent === 'register') {
                        navigate("/setup-password");
                    } else {
                        navigate("/");
                    }
                }, 1500);
            } catch (error) {
                setStatus('error');
                let errorMessage = t('loginProcessingError');
                if (error.message.includes('Token Google invalide')) {
                    errorMessage = t('invalidGoogleTokenError');
                } else if (error.message.includes('Impossible d\'obtenir les données')) {
                    errorMessage = t('authenticationDataError');
                }
                setMessage(errorMessage);
                setTimeout(() => navigate("/login?error=processing_error"), 2000);
            }
        };
        handleCallback();
    }, [navigate, t]);

    return (
        <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center">
            <div className="text-center">
                {status === 'processing' && (
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                )}
                {status === 'success' && (
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                )}
                {status === 'error' && (
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                )}
                <div className={`text-xl ${status === 'success' ? 'text-green-300' : status === 'error' ? 'text-red-300' : 'text-white'}`}>
                    {message}
                </div>
            </div>
        </div>
    )
}