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

                // Exchange Google tokens for Strapi JWT
                let strapiJWT = null;
                try {
                    console.log("Traitement des données Google...");
                    
                    // Extract user data from Google token
                    const tokenParts = idToken.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        console.log("Payload du token Google:", payload);

                        // Generate a unique username
                        const baseUsername = payload.email.split('@')[0];
                        const uniqueUsername = `${baseUsername}_${Date.now()}_${Math.random().toString(36).slice(-5)}`;
                        
                        // Generate a secure password
                        const securePassword = Math.random().toString(36).slice(-12) + '!A1a';
                        
                        console.log("Tentative de création d'utilisateur avec les données Google...");
                        
                        try {
                            const userResponse = await axios.post(
                                'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local/register',
                                {
                                    username: uniqueUsername,
                                    email: payload.email,
                                    password: securePassword
                                }
                            );
                            
                            strapiJWT = userResponse.data.jwt;
                            console.log("Utilisateur créé avec Google avec succès:", userResponse.data);
                        } catch (registerError) {
                            console.log("Erreur lors de la création:", registerError.response?.data || registerError.message);
                            
                            // Check if it's an email already exists error
                            const errorData = registerError.response?.data?.error;
                            if (errorData?.message?.includes('email') || errorData?.message?.includes('Email')) {
                                console.log("Email déjà existant, redirection vers la page de connexion...");
                                
                                // Store the email for the login page
                                localStorage.setItem('googleEmail', payload.email);
                                
                                setStatus('error');
                                setMessage(t('emailAlreadyExistsGoogle'));
                                
                                // Redirect to login page with a message
                                setTimeout(() => {
                                    navigate("/login?error=email_exists&email=" + encodeURIComponent(payload.email));
                                }, 2000);
                                return;
                            } else {
                                // If it's not an email conflict, try the original fallback
                                try {
                                    const loginResponse = await axios.post(
                                        'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local',
                                        {
                                            identifier: payload.email,
                                            password: securePassword
                                        }
                                    );
                                    
                                    strapiJWT = loginResponse.data.jwt;
                                    console.log("Connexion réussie avec Google:", loginResponse.data);
                                } catch (loginError) {
                                    console.error("Erreur lors de la connexion:", loginError.response?.data || loginError.message);
                                    
                                    // Final attempt: create user with different username
                                    try {
                                        const finalUsername = `google_user_${Date.now()}_${Math.random().toString(36).slice(-8)}`;
                                        const userResponse = await axios.post(
                                            'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local/register',
                                            {
                                                username: finalUsername,
                                                email: payload.email,
                                                password: securePassword
                                            }
                                        );
                                        
                                        strapiJWT = userResponse.data.jwt;
                                        console.log("Utilisateur créé avec nom d'utilisateur final:", userResponse.data);
                                    } catch (finalError) {
                                        console.error("Erreur finale:", finalError.response?.data || finalError.message);
                                        throw new Error("Impossible de créer ou connecter l'utilisateur Google");
                                    }
                                }
                            }
                        }
                    } else {
                        throw new Error("Token Google invalide");
                    }
                } catch (exchangeError) {
                    console.error("Erreur lors du traitement:", exchangeError.message);
                    throw new Error("Impossible d'échanger les tokens Google ou de créer/se connecter avec l'utilisateur");
                }

                if (!strapiJWT) {
                    throw new Error("Aucun JWT Strapi obtenu");
                }

                // Now get user data with Strapi JWT
                let userData = null;
                try {
                    const userResponse = await axios.get(
                        'https://stylish-basket-710b77de8f.strapiapp.com/api/users/me',
                        {
                            headers: {
                                Authorization: `Bearer ${strapiJWT}`
                            }
                        }
                    );
                    userData = userResponse.data;
                    console.log("Données utilisateur via /me:", userData);
                } catch (meError) {
                    console.log("Erreur avec /me, tentative avec décodage du JWT Strapi:", meError);

                    // Decode Strapi JWT to get user ID
                    try {
                        const tokenParts = strapiJWT.split('.');
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            console.log("Payload du JWT Strapi:", payload);

                            const userId = payload.id;
                            if (userId) {
                                const userResponse = await axios.get(
                                    `https://stylish-basket-710b77de8f.strapiapp.com/api/users/${userId}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${strapiJWT}`
                                        }
                                    }
                                );
                                userData = userResponse.data;
                                console.log("Données utilisateur via ID:", userData);
                            }
                        }
                    } catch (decodeError) {
                        console.error("Erreur lors du décodage du JWT Strapi:", decodeError);
                    }
                }

                if (!userData) {
                    throw new Error("Impossible de récupérer les données utilisateur");
                }

                // Traitement des données utilisateur
                const userInfo = userData.data || userData;

                // Store authentication data
                localStorage.setItem("token", strapiJWT);
                localStorage.setItem("user", JSON.stringify(userInfo.documentId || userInfo.id));
                localStorage.setItem("IDUser", userInfo.id);
                localStorage.setItem("role", "user");
                localStorage.setItem("userEmail", userInfo.email);
                localStorage.setItem("userName", userInfo.username);

                // Check if this is a new Google user (needs password setup)
                const isNewGoogleUser = localStorage.getItem('auth_intent') === 'register';
                const isLoginIntent = localStorage.getItem('auth_intent') === 'login';
                localStorage.removeItem('auth_intent');

                setStatus('success');
                setMessage(t('loginSuccess'));

                // Navigate based on whether user needs to set password
                setTimeout(() => {
                    if (isNewGoogleUser) {
                        navigate("/setup-password");
                    } else if (isLoginIntent) {
                        // For login, go directly to dashboard
                        navigate("/");
                    } else {
                        navigate("/to-owner");
                    }
                }, 1500);

            } catch (error) {
                console.error("Erreur lors du traitement du callback:", error);
                setStatus('error');
                
                // Provide more specific error messages
                let errorMessage = t('loginProcessingError');
                if (error.message.includes('Impossible d\'échanger les tokens Google')) {
                    errorMessage = t('googleTokenExchangeError');
                } else if (error.message.includes('Aucun JWT Strapi obtenu')) {
                    errorMessage = t('noStrapiTokenError');
                } else if (error.message.includes('Impossible de récupérer les données utilisateur')) {
                    errorMessage = t('userDataRetrievalError');
                } else if (error.message.includes('Token Google invalide')) {
                    errorMessage = t('invalidGoogleTokenError');
                } else if (error.message.includes('Impossible de créer ou connecter l\'utilisateur Google')) {
                    errorMessage = t('googleUserCreationError');
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