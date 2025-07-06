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
                const jwt = urlParams.get("jwt") || urlParams.get("id_token");
                const error = urlParams.get("error");
                
                if (jwt) {
                    localStorage.setItem("token", jwt);
                    // redirect or update auth state
                }
                
                if (error) {
                    console.error("Erreur d'authentification:", error);
                    setStatus('error');
                    setMessage(t('loginFailed'));
                    setTimeout(() => navigate("/login?error=" + error), 2000);
                    return;
                }

                if (!jwt) {
                    console.error("Pas de token reçu");
                    setStatus('error');
                    setMessage(t('noTokenReceived'));
                    setTimeout(() => navigate("/login?error=no_token"), 2000);
                    return;
                }

                console.log("Token reçu de Strapi:", jwt);

                // Méthode 1: Essayer d'abord avec /api/users/me
                let userData = null;
                try {
                    const userResponse = await axios.get(
                        'https://stylish-basket-710b77de8f.strapiapp.com/api/users/me',
                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`
                            }
                        }
                    );
                    userData = userResponse.data;
                    console.log("Données utilisateur via /me:", userData);
                } catch (meError) {
                    console.log("Erreur avec /me, tentative avec décodage du token:", meError);

                    // Méthode 2: Décoder le JWT pour obtenir l'ID utilisateur
                    try {
                        const tokenParts = jwt.split('.');
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            console.log("Payload du token:", payload);

                            const userId = payload.id;
                            if (userId) {
                                // Utiliser l'endpoint avec l'ID spécifique
                                const userResponse = await axios.get(
                                    `https://stylish-basket-710b77de8f.strapiapp.com/api/users/${userId}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${jwt}`
                                        }
                                    }
                                );
                                userData = userResponse.data;
                                console.log("Données utilisateur via ID:", userData);
                            }
                        }
                    } catch (decodeError) {
                        console.error("Erreur lors du décodage du token:", decodeError);
                    }
                }

                if (!userData) {
                    throw new Error("Impossible de récupérer les données utilisateur");
                }

                // Traitement des données utilisateur
                const userInfo = userData.data || userData;

                // Stocker les données d'authentification
                localStorage.setItem("token", jwt);
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
                setMessage(t('loginProcessingError'));
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