import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get("access_token");

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await axios.get(
          "https://stylish-basket-710b77de8f.strapiapp.com/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const user = response.data;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", "user");

        navigate("/to-owner");
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    getUserData();
  }, []);

  return <div className="text-white p-10">جارٍ تسجيل الدخول...</div>;
}
