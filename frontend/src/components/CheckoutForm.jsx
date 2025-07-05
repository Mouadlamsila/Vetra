import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { X, RefreshCw } from 'lucide-react';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

export default function CheckoutForm({ 
  amount, 
  onSuccess, 
  onCancel, 
  orderId, 
  product, 
  quantity, 
  userData,
  cartItems
}) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const createCheckoutSession = async (paymentMethod) => {
    try {
      const checkoutData = {
        data: {
          products: cartItems 
            ? cartItems.map(item => parseInt(item.product.id))
            : [parseInt(product.id)],
          quantities: cartItems
            ? cartItems.reduce((acc, item) => ({
                ...acc,
                [item.product.id]: parseInt(item.qte)
              }), {})
            : {
                [product.id]: parseInt(quantity)
              },
          user: parseInt(localStorage.getItem("IDUser")),
          amount: amount,
          currency: 'usd',
          status_checkout: "pending",
          customer: {
            email: userData?.email || '',
            name: userData?.username || '',
            phone: userData?.phone || '',
            address: {
              line1: userData?.address?.line1 || '',
              line2: userData?.address?.line2 || '',
              city: userData?.address?.city || '',
              state: userData?.address?.state || '',
              postal_code: userData?.address?.postal_code || '',
              country: userData?.address?.country || 'US'
            }
          },
          shippingAddress: {
            line1: userData?.address?.line1 || '',
            line2: userData?.address?.line2 || '',
            city: userData?.address?.city || '',
            state: userData?.address?.state || '',
            postal_code: userData?.address?.postal_code || '',
            country: userData?.address?.country || 'US'
          },
          order: orderId,
          paymentMethodId: paymentMethod.id
        }
      };

      const response = await fetch('https://stylish-basket-710b77de8f.strapiapp.com/api/checkout-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
        return;
      }

      // Try to create checkout session
      try {
        const response = await createCheckoutSession(paymentMethod);
        onSuccess(response);
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setIsRetrying(true);
          toast.info(t('checkout.retrying', { count: retryCount + 1, max: MAX_RETRIES }));
          
          // Wait for RETRY_DELAY before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          
          // Retry the checkout session creation
          const response = await createCheckoutSession(paymentMethod);
          onSuccess(response);
        } else {
          throw new Error(t('checkout.maxRetriesExceeded'));
        }
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
      setIsRetrying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('checkout.paymentDetails')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {t('checkout.cardDetails')}
          </label>
          <div className="p-3 border border-gray-300 rounded-md">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {isRetrying && (
          <div className="flex items-center gap-2 text-blue-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>{t('checkout.retrying', { count: retryCount + 1, max: MAX_RETRIES })}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {t('checkout.cancel')}
          </button>
          
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              !stripe || isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isProcessing ? t('checkout.processing') : `${t('checkout.pay')} $${amount}`}
          </button>
        </div>
      </form>
    </div>
  );
} 