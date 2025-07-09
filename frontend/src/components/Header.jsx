import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const handleCheckout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
        return;
      }

      const customer = {
        email: user.email,
        name: user.username,
        phone: user.phone || "",
        address: {
          line1: user.address?.line1 || "",
          line2: user.address?.line2 || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          postal_code: user.address?.postal_code || "",
          country: user.address?.country || "US"
        }
      };

      const shippingAddress = {
        line1: user.address?.line1 || "",
        line2: user.address?.line2 || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        postal_code: user.address?.postal_code || "",
        country: user.address?.country || "US"
      };

      const response = await axios.post(
        "https://useful-champion-e28be6d32c.strapiapp.com/api/checkout-sessions",
        {
          cartItems: cartItems,
          userId: user.id,
          customer: customer,
          shippingAddress: shippingAddress
        }
      );

      if (response.data.sessionId) {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Error during checkout. Please try again.");
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default Header; 