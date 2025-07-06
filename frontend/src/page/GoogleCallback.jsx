import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        console.log("=== DEBUT DEBUG GOOGLE AUTH ===");
        console.log("Full URL:", window.location.href);
        console.log("Search params:", window.location.search);
        console.log("Hash:", window.location.hash);
        
        // Récupérer les paramètres de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("access_token");
        
        console.log("Access token from params:", accessToken);
        
        // Si pas de token dans les params, essayer dans le hash
        if (!accessToken) {
          const hash = window.location.hash;
          const hashParams = new URLSearchParams(hash.slice(1));
          const hashToken = hashParams.get("access_token");
          
          console.log("Access token from hash:", hashToken);
          
          if (!hashToken) {
            console.error("No access token found in URL or hash");
            navigate("/login?error=no_token");
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
        navigate("/login?error=callback_error");
      }
    };

    const processToken = async (token) => {
      try {
        console.log("Processing token:", token);
        
        // Test 1: Vérifier si le token est valide
        console.log("=== TEST 1: Vérification du token ===");
        
        // Test 2: Récupérer les données utilisateur depuis Strapi
        console.log("=== TEST 2: Récupération des données utilisateur ===");
        const response = await axios.get(
          "https://stylish-basket-710b77de8f.strapiapp.com/api/users/me?populate=role",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("User response status:", response.status);
        console.log("User response data:", response.data);
        
        const user = response.data;

        // Vérifier la structure des données
        if (!user || !user.id) {
          console.error("Invalid user data structure:", user);
          navigate("/login?error=invalid_user_data");
          return;
        }

        // Stocker les données d'authentification
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user.documentId || user.id));
        localStorage.setItem("IDUser", user.id);
        
        // Déterminer le rôle basé sur les données utilisateur
        const userRole = user.role?.name?.toLowerCase() || "user";
        localStorage.setItem("role", userRole);

        console.log("=== AUTH SUCCESS ===");
        console.log("Token stored:", token);
        console.log("User ID stored:", user.id);
        console.log("Document ID stored:", user.documentId || user.id);

        // Rediriger vers la page principale
        navigate("/to-owner");
        
      } catch (error) {
        console.error("=== ERROR DETAILS ===");
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        console.error("Error message:", error.message);
        
        // Gestion des erreurs spécifiques
        if (error.response?.status === 401) {
          console.error("Token invalide ou expiré");
          navigate("/login?error=invalid_token");
        } else if (error.response?.status === 403) {
          console.error("Accès refusé");
          navigate("/login?error=access_denied");
        } else if (error.response?.status === 404) {
          console.error("Endpoint non trouvé");
          navigate("/login?error=endpoint_not_found");
        } else {
          console.error("Erreur lors de la récupération des données utilisateur");
          navigate("/login?error=user_fetch_failed");
        }
      }
    };

    handleGoogleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-xl">جارٍ تسجيل الدخول...</div>
        <div className="text-white text-sm mt-2">Vérification des données...</div>
      </div>
    </div>
  );
}