import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import useAuth from '../../Context/useAuth';
import toast from 'react-hot-toast';

export default function PaymentEventFee() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosInstance = useAxiosSecurity();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            userEmail: user?.email || '',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardholderName: ''
        }
    });

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
    const paymentMutation = useMutation({
        mutationFn: async (paymentData) => {
            // 1. Create payment record
            const paymentPayload = {
                userEmail: userEmail || user?.email,
                amount: event.eventFee,
                type: 'event',
                eventId: event._id,
                clubId: clubId || event.clubId,
                status: 'completed',
                paymentMethod: 'card',
                cardLast4: paymentData.cardNumber.slice(-4)
            };

            const paymentRes = await axiosInstance.post('/payments', paymentPayload);

            if (!paymentRes.data.insertedId) {
                throw new Error('Payment processing failed');
            }

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

            if (!registrationRes.data.acknowledged) {
                throw new Error('Event registration failed');
            }

            return { payment: paymentRes.data, registration: registrationRes.data };
        },
        onSuccess: () => {
            toast.success('Payment successful! You are registered for the event!');
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['my_registrations'] });
            queryClient.invalidateQueries({ queryKey: ['event-registrations'] });

            // Navigate to dashboard or events page
            setTimeout(() => {
                navigate('/dashboard/my-events');
            }, 1500);
        },
        onError: (err) => {
            toast.error('Payment failed: ' + (err.response?.data?.message || err.message));
        },
    });

    const onSubmit = (data) => {
        paymentMutation.mutate(data);
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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                value={userEmail || user?.email}
                                className="input input-bordered w-full"
                                disabled
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Cardholder Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="input input-bordered w-full"
                                {...register('cardholderName', { required: 'Cardholder name is required' })}
                            />
                            {errors.cardholderName && (
                                <span className="text-error text-sm mt-1">{errors.cardholderName.message}</span>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Card Number</span>
                            </label>
                            <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="input input-bordered w-full"
                                maxLength="19"
                                {...register('cardNumber', {
                                    required: 'Card number is required',
                                    pattern: {
                                        value: /^[0-9\s]{13,19}$/,
                                        message: 'Invalid card number'
                                    }
                                })}
                            />
                            {errors.cardNumber && (
                                <span className="text-error text-sm mt-1">{errors.cardNumber.message}</span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Expiry Date</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="input input-bordered w-full"
                                    maxLength="5"
                                    {...register('expiryDate', {
                                        required: 'Expiry date is required',
                                        pattern: {
                                            value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                                            message: 'Format: MM/YY'
                                        }
                                    })}
                                />
                                {errors.expiryDate && (
                                    <span className="text-error text-sm mt-1">{errors.expiryDate.message}</span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">CVV</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    className="input input-bordered w-full"
                                    maxLength="4"
                                    {...register('cvv', {
                                        required: 'CVV is required',
                                        pattern: {
                                            value: /^[0-9]{3,4}$/,
                                            message: 'Invalid CVV'
                                        }
                                    })}
                                />
                                {errors.cvv && (
                                    <span className="text-error text-sm mt-1">{errors.cvv.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-control mt-6 flex flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn btn-outline flex-1"
                                disabled={paymentMutation.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex-1"
                                disabled={paymentMutation.isPending}
                            >
                                {paymentMutation.isPending ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Processing...
                                    </>
                                ) : (
                                    `Pay $${event.eventFee}`
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}