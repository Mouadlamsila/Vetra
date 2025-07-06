import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("access_token");
        
        // Si pas de token dans les params, essayer dans le hash
        if (!accessToken) {
          const hash = window.location.hash;
          const hashParams = new URLSearchParams(hash.slice(1));
          const hashToken = hashParams.get("access_token");
          
          if (!hashToken) {
            console.error("No access token found in URL or hash");
            navigate("/login?error=auth_failed");
            return;
          }
          
          // Utiliser le token du hash
          await processToken(hashToken);
        } else {
          // Utiliser le token des params
          await processToken(accessToken);
        }
      } catch (error) {
        console.error("Error in Google auth callback:", error);
        navigate("/login?error=auth_failed");
      }
    };

    const processToken = async (token) => {
      try {
        // Récupérer les données utilisateur depuis Strapi
        const response = await axios.get(
          "https://stylish-basket-710b77de8f.strapiapp.com/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data;
        console.log("User data received:", user);

        // Stocker les données d'authentification
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user.documentId || user.id));
        localStorage.setItem("IDUser", user.id);
        localStorage.setItem("role", "user");

        // Rediriger vers la page principale
        navigate("/to-owner");
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login?error=user_fetch_failed");
      }
    };

    handleGoogleAuth();
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