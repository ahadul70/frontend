import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import useAuth from '../../Context/useAuth';
import toast from 'react-hot-toast';

export default function PaymentClubsFee() {
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
  const paymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      // 1. Create payment record
      const paymentPayload = {
        userEmail: userEmail || user?.email,
        amount: club.membershipFee,
        type: 'membership',
        clubId: club._id,
        status: 'completed',
        paymentMethod: 'card',
        cardLast4: paymentData.cardNumber.slice(-4)
      };

      const paymentRes = await axiosInstance.post('/payments', paymentPayload);

      if (!paymentRes.data.insertedId) {
        throw new Error('Payment processing failed');
      }

      // 2. Create membership after successful payment
      const membershipData = {
        userEmail: userEmail || user?.email,
        clubId: club._id,
        status: 'active',
        paymentId: paymentRes.data.insertedId,
        joinedAt: new Date(),
      };

      const membershipRes = await axiosInstance.post('/memberships', membershipData);

      if (!membershipRes.data.acknowledged) {
        throw new Error('Membership creation failed');
      }

      return { payment: paymentRes.data, membership: membershipRes.data };
    },
    onSuccess: () => {
      toast.success('Payment successful! You are now a member!');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['user-memberships'] });
      queryClient.invalidateQueries({ queryKey: ['memberships'] });

      // Navigate to dashboard or club details
      setTimeout(() => {
        navigate(`/club/${club._id}`);
      }, 1500);
    },
    onError: (err) => {
      if (err.response?.status === 409) {
        toast.error('You already have an active membership for this club!');
      } else {
        toast.error('Payment failed: ' + (err.response?.data?.message || err.message));
      }
    },
  });

  const onSubmit = (data) => {
    paymentMutation.mutate(data);
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
                  `Pay $${club.membershipFee}`
                )}
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
}