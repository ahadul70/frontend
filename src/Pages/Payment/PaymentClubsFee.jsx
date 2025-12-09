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

export default function PaymentClubsFee() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxiosSecurity();
  const queryClient = useQueryClient();

  // Get club and payment details from navigation state
  const { club, userEmail } = location.state || {};

  // Redirect if no club data
  React.useEffect(() => {
    if (!club) {
      toast.error('No club selected for payment');
      navigate('/');
    }
  }, [club, navigate]);

  // Payment and membership creation mutation
  const handlePaymentSuccess = async (paymentIntent) => {
    const paymentPayload = {
      userEmail: userEmail || user?.email,
      amount: club.membershipFee,
      type: 'membership',
      clubId: club._id,
      status: 'completed',
      paymentMethod: 'card',
      transactionId: paymentIntent.id
    };

    try {
      const paymentRes = await axiosInstance.post('/payments', paymentPayload);

      if (paymentRes.data.insertedId) {
        // 2. Create membership after successful payment
        const membershipData = {
          userEmail: userEmail || user?.email,
          clubId: club._id,
          status: 'active',
          paymentId: paymentRes.data.insertedId,
          joinedAt: new Date(),
        };

        const membershipRes = await axiosInstance.post('/memberships', membershipData);

        if (membershipRes.data.acknowledged) {
          toast.success('Payment successful! You are now a member!');
          queryClient.invalidateQueries({ queryKey: ['clubs'] });
          queryClient.invalidateQueries({ queryKey: ['user-memberships'] });
          queryClient.invalidateQueries({ queryKey: ['memberships'] });

          // Navigate to dashboard or club details
          setTimeout(() => {
            navigate(`/club/${club._id}`);
          }, 1500);
        }
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('You already have an active membership for this club!');
      } else {
        toast.error('Payment failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };


  if (!club) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-2xl shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center mb-6">Payment Details</h2>

          <div className="alert alert-info mb-6">
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{club.clubName}</span>
                <span className="badge badge-secondary">{club.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Membership Fee:</span>
                <span className="text-2xl font-bold text-primary">${club.membershipFee}</span>
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
            <CheckoutForm price={club.membershipFee} onSuccess={handlePaymentSuccess} />
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