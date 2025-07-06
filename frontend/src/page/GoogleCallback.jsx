import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const access_token = urlParams.get("access_token");

        if (!access_token) {
          throw new Error("Access token not found");
        }

        // طلب بيانات المستخدم من Strapi
        const response = await axios.get("https://stylish-basket-710b77de8f.strapiapp.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        // تخزين JWT والمستخدم فـ localStorage
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("role", "user");

        // إعادة التوجيه
        navigate("/to-owner");
      } catch (error) {
        console.error("Google callback error:", error);
        navigate("/register"); // أو صفحة الخطأ
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="text-white text-center py-10">
      <h1 className="text-2xl">جارٍ تسجيل الدخول بحساب Google...</h1>
    </div>
  );
}
