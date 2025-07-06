import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = () => {
            console.log("=== CALLBACK STRAPI ===");
            console.log("URL:", window.location.href);
            
            const urlParams = new URLSearchParams(window.location.search);
            const accessToken = urlParams.get("access_token");
            const error = urlParams.get("error");
            
            if (error) {
                console.error("Erreur:", error);
                navigate("/login?error=" + error);
                return;
            }
            
            if (accessToken) {
                console.log("Token reçu de Strapi:", accessToken);
                
                // Stocker le token JWT de Strapi
                localStorage.setItem("token", accessToken);
                localStorage.setItem("role", "user");
                
                // Rediriger vers la page principale
                navigate("/to-owner");
            } else {
                console.error("Pas de token reçu");
                navigate("/login?error=no_token");
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-white text-xl">جارٍ تسجيل الدخول...</div>
            </div>
        </div>
    );
}