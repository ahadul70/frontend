import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import useAuth from '../../Context/useAuth';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// Make sure to add VITE_PAYMENT_GATEWAY_PK to your .env file
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

export default function PaymentEventFee() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosInstance = useAxiosSecurity();
    const queryClient = useQueryClient();

    // Get event and payment details from navigation state
    const { event, userEmail, clubId } = location.state || {};

    // Redirect if no event data
    React.useEffect(() => {
        if (!event) {
            toast.error('No event selected for payment');
            navigate('/');
        }
    }, [event, navigate]);

    // Payment and event registration mutation
    const handlePaymentSuccess = async (paymentIntent) => {
        // 1. Create payment record
        const paymentPayload = {
            userEmail: userEmail || user?.email,
            amount: event.eventFee,
            type: 'event',
            eventId: event._id,
            clubId: clubId || event.clubId,
            status: 'completed',
            paymentMethod: 'card',
            transactionId: paymentIntent.id
        };

        try {
            const paymentRes = await axiosInstance.post('/payments', paymentPayload);

            if (paymentRes.data.insertedId) {
                // 2. Create event registration after successful payment
                const registrationData = {
                    userEmail: userEmail || user?.email,
                    eventId: event._id,
                    clubId: clubId || event.clubId,
                    status: 'registered',
                    paymentId: paymentRes.data.insertedId,
                    registeredAt: new Date(),
                };

                const registrationRes = await axiosInstance.post('/event-registrations', registrationData);

                if (registrationRes.data.acknowledged) {
                    toast.success('Payment successful! You are registered for the event!');
                    queryClient.invalidateQueries({ queryKey: ['events'] });
                    queryClient.invalidateQueries({ queryKey: ['my_registrations'] });
                    queryClient.invalidateQueries({ queryKey: ['event-registrations'] });

                    // Navigate to dashboard or events page
                    setTimeout(() => {
                        navigate('/dashboard/my-events');
                    }, 1500);
                }
            }
        } catch (err) {
            toast.error('Payment failed: ' + (err.response?.data?.message || err.message));
        }
    };


    if (!event) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-2xl shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title text-3xl justify-center mb-6">Event Payment</h2>

                    <div className="alert alert-info mb-6">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg">{event.title}</span>
                                <span className="badge badge-secondary">{event.category || 'Event'}</span>
                            </div>
                            {event.date && (
                                <div className="text-sm mb-2">
                                    <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span>Event Fee:</span>
                                <span className="text-2xl font-bold text-primary">${event.eventFee}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            value={userEmail || user?.email}
                            className="input input-bordered w-full mb-4"
                            disabled
                        />
                    </div>

                    <Elements stripe={stripePromise}>
                        <CheckoutForm price={event.eventFee} onSuccess={handlePaymentSuccess} />
                    </Elements>
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-outline btn-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}