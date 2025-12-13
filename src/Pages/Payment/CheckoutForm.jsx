import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import useAuth from '../../Context/useAuth';

const CheckoutForm = ({ price, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [cardError, setCardError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const axiosInstance = useAxiosSecurity();

    useEffect(() => {
        if (price > 0) {
            axiosInstance.post('/create-payment-intent', { price })
                .then(res => {
                    console.log(res.data.clientSecret);
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error("Error fetching client secret", err);
                    setCardError("Failed to initialize payment. Please refresh.");
                });
        }
    }, [axiosInstance, price]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
            setCardError(error.message);
            toast.error(error.message);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            setCardError('');
        }

        setProcessing(true);

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: user?.displayName || 'anonymous',
                        email: user?.email || 'anonymous'
                    },
                },
            },
        );

        if (confirmError) {
            console.log(confirmError);
            setCardError(confirmError.message);
            toast.error(confirmError.message);
            setProcessing(false);
        } else {
            console.log('payment intent', paymentIntent);
            if (paymentIntent.status === 'succeeded') {
                setProcessing(false);
                toast.success(`Payment Successful! TransactionId: ${paymentIntent.id}`);
                onSuccess(paymentIntent);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
                <Toaster />
                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
                {!stripe && <p className="text-xs text-warning mt-1">Loading Stripe...</p>}
                {!clientSecret && stripe && <p className="text-xs text-warning mt-1">Initializing Payment...</p>}
            </div>
            {cardError && <p className="text-red-600 mb-4">{cardError}</p>}
            <button
                className="btn btn-primary w-full my-4"
                type="submit"
                disabled={!stripe || !clientSecret || processing}
            >
                {processing ? <span className="loading loading-spinner"></span> : `Pay $${price}`}
            </button>
        </form>
    );
};

export default CheckoutForm;
