import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function CallbackOfRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState(t('processingLogin'));

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const idToken = urlParams.get("id_token");
        const accessToken = urlParams.get("access_token");
        const error = urlParams.get("error");

        if (error) {
          setStatus('error');
          setMessage(t('loginFailed'));
          setTimeout(() => navigate("/login?error=" + error), 2000);
          return;
        }
        if (!idToken || !accessToken) {
          setStatus('error');
          setMessage(t('noTokenReceived'));
          setTimeout(() => navigate("/login?error=no_token"), 2000);
          return;
        }

        // Decode Google id_token to get email
        const tokenParts = idToken.split('.');
        if (tokenParts.length !== 3) throw new Error("Token Google invalide");
        const payload = JSON.parse(atob(tokenParts[1]));
        const userEmail = payload.email;
        const baseUsername = userEmail.split('@')[0];

        // Check if user exists in Strapi
        const res = await axios.get(
          `https://stylish-basket-710b77de8f.strapiapp.com/api/users?filters[email][$eq]=${userEmail}`
        );
        const userExists = res.data.data?.length > 0;

        if (userExists) {
          const existingUser = res.data.data[0];

          // Store user info and Google access token
          localStorage.setItem("token", accessToken); // Google access_token
          localStorage.setItem("user", JSON.stringify(existingUser.id));
          localStorage.setItem("IDUser", existingUser.id);
          localStorage.setItem("role", "user");
          localStorage.setItem("userEmail", userEmail);
          localStorage.setItem("userName", existingUser.username || userEmail.split("@")[0]);
          localStorage.setItem("googleAuth", "true");

          setStatus('success');
          setMessage(t('loginSuccess'));
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          // Register the user with Google email
          try {
            const uniqueUsername = `${baseUsername}_${Date.now()}_${Math.random().toString(36).slice(-5)}`;
            const securePassword = Math.random().toString(36).slice(-12) + '!A1a';
            const registerResponse = await axios.post(
              'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local/register',
              {
                username: uniqueUsername,
                email: userEmail,
                password: securePassword
              }
            );
            const userData = registerResponse.data.user;
            // Store user info and Google access token
            localStorage.setItem("token", accessToken); // Google access_token
            localStorage.setItem("user", JSON.stringify(userData.id));
            localStorage.setItem("IDUser", userData.id);
            localStorage.setItem("role", "user");
            localStorage.setItem("userEmail", userEmail);
            localStorage.setItem("userName", userData.username || userEmail.split("@")[0]);
            localStorage.setItem("googleAuth", "true");

            setStatus('success');
            setMessage(t('registrationSuccess'));
            setTimeout(() => {
              navigate("/setup-password");
            }, 1200);
          } catch (registerError) {
            setStatus('error');
            setMessage(t('registrationError'));
            setTimeout(() => navigate("/register?error=google_register_failed"), 2000);
          }
        }
      } catch (error) {
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