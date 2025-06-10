import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

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

export default function StripeCheckoutForm({ amount, onSuccess, onCancel }) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

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

      // Call the success callback with the payment method
      onSuccess(paymentMethod);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
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