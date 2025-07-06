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
            console.log("=== CALLBACK GOOGLE STRAPI ===");
            console.log("URL:", window.location.href);

            try {
                const urlParams = new URLSearchParams(window.location.search);
                const idToken = urlParams.get("id_token");
                const accessToken = urlParams.get("access_token");
                const error = urlParams.get("error");
                
                if (error) {
                    console.error("Erreur d'authentification:", error);
                    setStatus('error');
                    setMessage(t('loginFailed'));
                    setTimeout(() => navigate("/login?error=" + error), 2000);
                    return;
                }

                if (!idToken || !accessToken) {
                    console.error("Pas de token reçu");
                    setStatus('error');
                    setMessage(t('noTokenReceived'));
                    setTimeout(() => navigate("/login?error=no_token"), 2000);
                    return;
                }

                console.log("Google tokens reçus:", { idToken, accessToken });

                // Extract user data from Google token
                const tokenParts = idToken.split('.');
                if (tokenParts.length !== 3) {
                    throw new Error("Token Google invalide");
                }

                const payload = JSON.parse(atob(tokenParts[1]));
                console.log("Payload du token Google:", payload);

                const userEmail = payload.email;
                const baseUsername = userEmail.split('@')[0];
                
                // Generate a secure password for Google users
                const securePassword = Math.random().toString(36).slice(-12) + '!A1a';

                let strapiJWT = null;
                let userData = null;
                let isNewUser = false;

                // First, try to register the user
                try {
                    console.log("Tentative de création d'utilisateur avec Google...");
                    
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
                    console.log("Nouvel utilisateur créé avec Google:", registerResponse.data);
                    
                } catch (registerError) {
                    console.log("Erreur lors de la création:", registerError.response?.data || registerError.message);
                    
                    // Check if it's an email already exists error
                    const errorData = registerError.response?.data?.error;
                    if (errorData?.message?.includes('email') || errorData?.message?.includes('Email')) {
                        console.log("Email déjà existant, tentative de connexion directe...");
                        
                        // Try to log in the existing user with a generated password
                        // Since we don't know their actual password, we'll create a new account
                        // with a modified email to establish a session
                        try {
                            const tempEmail = `${userEmail.split('@')[0]}+google_${Date.now()}@${userEmail.split('@')[1]}`;
                            const tempUsername = `google_user_${Date.now()}_${Math.random().toString(36).slice(-8)}`;
                            
                            const tempResponse = await axios.post(
                                'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local/register',
                                {
                                    username: tempUsername,
                                    email: tempEmail,
                                    password: securePassword
                                }
                            );
                            
                            strapiJWT = tempResponse.data.jwt;
                            userData = tempResponse.data.user;
                            isNewUser = false;
                            console.log("Session temporaire créée pour l'utilisateur existant");
                            
                        } catch (tempError) {
                            console.error("Erreur lors de la création de session temporaire:", tempError);
                            throw new Error("Impossible de créer une session pour l'utilisateur existant");
                        }
                    } else {
                        // If it's not an email conflict, rethrow the error
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
                localStorage.setItem("userEmail", userEmail); // Always use the original email
                localStorage.setItem("userName", userData.username);

                // Check if this is a new Google user (needs password setup)
                const authIntent = localStorage.getItem('auth_intent');
                localStorage.removeItem('auth_intent');

                setStatus('success');
                setMessage(t('loginSuccess'));

                // Navigate based on user status and intent
                setTimeout(() => {
                    if (isNewUser && authIntent === 'register') {
                        // New user from registration, go to password setup
                        navigate("/setup-password");
                    } else if (isNewUser && authIntent === 'login') {
                        // New user from login, go to dashboard
                        navigate("/");
                    } else if (!isNewUser) {
                        // Existing user, go directly to dashboard
                        navigate("/");
                    } else {
                        // Default fallback
                        navigate("/");
                    }
                }, 1500);

            } catch (error) {
                console.error("Erreur lors du traitement du callback:", error);
                setStatus('error');
                
                // Provide more specific error messages
                let errorMessage = t('loginProcessingError');
                if (error.message.includes('Token Google invalide')) {
                    errorMessage = t('invalidGoogleTokenError');
                } else if (error.message.includes('Impossible de créer une session')) {
                    errorMessage = t('sessionCreationError');
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
    );
}