import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
    const [message, setMessage] = useState('جارٍ تسجيل الدخول...');

    useEffect(() => {
        const handleCallback = async () => {
            console.log("=== CALLBACK GOOGLE STRAPI ===");
            console.log("URL:", window.location.href);
            
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const accessToken = urlParams.get("access_token");
                const error = urlParams.get("error");
                
                if (error) {
                    console.error("Erreur d'authentification:", error);
                    setStatus('error');
                    setMessage('فشل في تسجيل الدخول');
                    setTimeout(() => navigate("/login?error=" + error), 2000);
                    return;
                }
                
                if (!accessToken) {
                    console.error("Pas de token reçu");
                    setStatus('error');
                    setMessage('لم يتم استلام رمز الوصول');
                    setTimeout(() => navigate("/login?error=no_token"), 2000);
                    return;
                }

                console.log("Token reçu de Strapi:", accessToken);
                
                // Récupérer les informations de l'utilisateur
                const userResponse = await axios.get(
                    'https://stylish-basket-710b77de8f.strapiapp.com/api/users/me',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );

                const userData = userResponse.data;
                console.log("Données utilisateur:", userData);

                // Vérifier si c'est un nouvel utilisateur et s'assurer qu'il a le bon rôle
                if (userData.role?.name !== 'Authenticated') {
                    try {
                        await axios.put(
                            `https://stylish-basket-710b77de8f.strapiapp.com/api/users/${userData.id}`,
                            { role: 1 }, // ID du rôle "Authenticated"
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }
                        );
                    } catch (roleError) {
                        console.warn("Erreur lors de la mise à jour du rôle:", roleError);
                    }
                }

                // Stocker les données d'authentification
                localStorage.setItem("token", accessToken);
                localStorage.setItem("user", JSON.stringify(userData.documentId || userData.id));
                localStorage.setItem("IDUser", userData.id);
                localStorage.setItem("role", "user");
                localStorage.setItem("userEmail", userData.email);
                localStorage.setItem("userName", userData.username);

                // Nettoyer l'intention d'auth
                localStorage.removeItem('auth_intent');

                setStatus('success');
                setMessage('تم تسجيل الدخول بنجاح!');
                
                // Rediriger vers la page principale
                setTimeout(() => navigate("/to-owner"), 1500);
                
            } catch (error) {
                console.error("Erreur lors du traitement du callback:", error);
                setStatus('error');
                setMessage('حدث خطأ أثناء معالجة تسجيل الدخول');
                setTimeout(() => navigate("/login?error=processing_error"), 2000);
            }
        };

        handleCallback();
    }, [navigate]);

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