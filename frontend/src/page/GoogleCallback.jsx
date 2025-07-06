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
                    console.log("Tentative d'échange des tokens Google avec Strapi...");
                    const exchangeResponse = await axios.post(
                        'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/google/callback',
                        {
                            id_token: idToken,
                            access_token: accessToken
                        }
                    );
                    
                    strapiJWT = exchangeResponse.data.jwt;
                    console.log("Strapi JWT obtenu avec succès:", strapiJWT);
                } catch (exchangeError) {
                    console.error("Erreur lors de l'échange de tokens:", exchangeError.response?.data || exchangeError.message);
                    
                    // Fallback: try to create user with Google data
                    try {
                        console.log("Tentative de création d'utilisateur avec les données Google...");
                        const tokenParts = idToken.split('.');
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            console.log("Payload du token Google:", payload);

                            // Try to register/login user with Google data
                            const userResponse = await axios.post(
                                'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local/register',
                                {
                                    username: payload.email.split('@')[0] + '_' + Date.now(),
                                    email: payload.email,
                                    password: Math.random().toString(36).slice(-10) + '!A1',
                                    provider: 'google',
                                    googleId: payload.sub
                                }
                            );
                            
                            strapiJWT = userResponse.data.jwt;
                            console.log("Utilisateur créé avec Google avec succès:", userResponse.data);
                        }
                    } catch (fallbackError) {
                        console.error("Erreur lors de la création d'utilisateur:", fallbackError.response?.data || fallbackError.message);
                        
                        // Try login if registration fails (user might already exist)
                        try {
                            console.log("Tentative de connexion avec les données Google...");
                            const loginResponse = await axios.post(
                                'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local',
                                {
                                    identifier: payload.email,
                                    password: 'temp_password_for_google_user'
                                }
                            );
                            
                            strapiJWT = loginResponse.data.jwt;
                            console.log("Connexion réussie avec Google:", loginResponse.data);
                        } catch (loginError) {
                            console.error("Erreur lors de la connexion:", loginError.response?.data || loginError.message);
                            throw new Error("Impossible d'échanger les tokens Google ou de créer/se connecter avec l'utilisateur");
                        }
                    }
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

                // Stocker les données d'authentification
                localStorage.setItem("token", strapiJWT);
                localStorage.setItem("user", JSON.stringify(userInfo.documentId || userInfo.id));
                localStorage.setItem("IDUser", userInfo.id);
                localStorage.setItem("role", "user");
                localStorage.setItem("userEmail", userInfo.email);
                localStorage.setItem("userName", userInfo.username);

                // Nettoyer l'intention d'auth
                localStorage.removeItem('auth_intent');

                setStatus('success');
                setMessage(t('loginSuccess'));

                // Rediriger vers la page principale
                setTimeout(() => navigate("/to-owner"), 1500);

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