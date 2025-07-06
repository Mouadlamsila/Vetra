import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = new URL(window.location.href);
        const access_token = url.searchParams.get("access_token");

        if (!access_token) {
          throw new Error("Token not found in URL");
        }

        // Get user data from Strapi
        const res = await axios.get("https://stylish-basket-710b77de8f.strapiapp.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("role", "user");

        navigate("/to-owner");
      } catch (error) {
        console.error("Google callback error:", error);
        navigate("/register");
      }
    };

    fetchUser();
  }, [navigate]);

  return <div className="text-white text-center py-10 text-xl">جارٍ التحقق من الحساب...</div>;
}
