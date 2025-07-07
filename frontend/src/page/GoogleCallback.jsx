import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function GoogleCallback() {
    const { t } = useTranslation();
    const [status, setStatus] = useState("processing");
    const [message, setMessage] = useState(t("processingLogin"));

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const idToken = urlParams.get("id_token");
                const accessToken = urlParams.get("access_token");
                const error = urlParams.get("error");

                if (error || !idToken || !accessToken) {
                    setStatus("error");
                    setMessage(error ? t("loginFailed") : t("noTokenReceived"));
                    setTimeout(() => window.location.href = "/login?error=auth_error", 2000);
                    return;
                }

                const tokenParts = idToken.split(".");
                if (tokenParts.length !== 3) throw new Error("Token Google invalide");

                const payload = JSON.parse(atob(tokenParts[1]));
                const userEmail = payload.email;
                const baseUsername = userEmail.split("@")[0];
                const securePassword = Math.random().toString(36).slice(-12) + "!A1a";
                const authIntent = localStorage.getItem("auth_intent") || "login";
                localStorage.removeItem("auth_intent");

                await handleLoginOrRegister({
                    userEmail,
                    baseUsername,
                    accessToken,
                    securePassword,
                    authIntent
                });
            } catch (err) {
                console.error("Erreur callback:", err);
                setStatus("error");
                setMessage(t("loginProcessingError"));
                setTimeout(() => window.location.href = "/login?error=callback", 2000);
            }
        };

        handleCallback();
    }, [t]);

    const handleLoginOrRegister = async ({ userEmail, baseUsername, accessToken, securePassword, authIntent }) => {
        try {
            const res = await axios.get(
                `https://stylish-basket-710b77de8f.strapiapp.com/api/users?filters[email][$eq]=${userEmail}`
            );

            const userExists = res.data.data?.length > 0;

            if (userExists) {
                const existingUser = res.data.data[0];

                localStorage.setItem("token", accessToken);
                localStorage.setItem("user", JSON.stringify(existingUser.id));
                localStorage.setItem("IDUser", existingUser.id);
                localStorage.setItem("role", "user");
                localStorage.setItem("userEmail", userEmail);
                localStorage.setItem("userName", existingUser.username || baseUsername);
                localStorage.setItem("googleAuth", "true");

                setStatus("success");
                setMessage(t("loginSuccess"));

                setTimeout(() => window.location.href = "/", 1500);
                return;
            }

            // Register new user
            const uniqueUsername = `${baseUsername}_${Date.now()}_${Math.random().toString(36).slice(-5)}`;
            const registerRes = await axios.post(
                "https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local/register",
                {
                    username: uniqueUsername,
                    email: userEmail,
                    password: securePassword
                }
            );

            const { jwt, user } = registerRes.data;

            localStorage.setItem("token", jwt);
            localStorage.setItem("user", JSON.stringify(user.id));
            localStorage.setItem("IDUser", user.id);
            localStorage.setItem("role", "user");
            localStorage.setItem("userEmail", userEmail);
            localStorage.setItem("userName", user.username);

            setStatus("success");
            setMessage(t("loginSuccess"));

            setTimeout(() => {
                if (authIntent === "register") {
                    window.location.href = "/setup-password";
                } else {
                    window.location.href = "/";
                }
            }, 1500);
        } catch (err) {
            console.error("Login/Register failed:", err.response?.data || err.message);
            setStatus("error");
            setMessage(t("loginProcessingError"));
            setTimeout(() => window.location.href = "/login?error=register_or_login", 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center">
            <div className="text-center">
                {status === "processing" && (
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                )}

                {status === "success" && (
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                {status === "error" && (
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}

                <div className={`text-xl ${status === "success" ? "text-green-300" : status === "error" ? "text-red-300" : "text-white"}`}>
                    {message}
                </div>
            </div>
        </div>
    );
}
