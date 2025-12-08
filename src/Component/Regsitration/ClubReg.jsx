import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function ClubJoin() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const axiosInstance = useAxiosSecurity();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch clubs list
  const {
    data: clubs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/clubs');
      return data;
    }
  });

  // Pre‑select club when coming from ClubDetails
  useEffect(() => {
    if (clubs.length > 0 && location.state?.clubId) {
      const pre = clubs.find(c => c._id === location.state.clubId);
      if (pre) {
        setValue('clubId', pre._id);
        setSelectedClub(pre);
      }
    }
  }, [clubs, location.state, setValue]);

  const [selectedClub, setSelectedClub] = React.useState(null);

  const handleClubChange = e => {
    const id = e.target.value;
    const club = clubs.find(c => c._id === id);
    setSelectedClub(club);
  };


  // Mutation for free clubs only (paid clubs go through payment page)
  const joinMutation = useMutation({
    mutationFn: async data => {
      // Create membership directly (no payment needed for free clubs)
      const membershipData = {
        userEmail: data.userEmail,
        clubId: selectedClub._id,
        status: 'active',
        paymentId: null,
        joinedAt: new Date(),
      };
      const membershipRes = await axiosInstance.post('/memberships', membershipData);
      if (!membershipRes.data.acknowledged) throw new Error('Membership creation failed');
      return membershipRes;
    },
    onSuccess: () => {
      toast.success('Successfully joined club!');
      reset();
      setSelectedClub(null);
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['user-memberships'] });
    },
    onError: err => {
      // Check if it's a duplicate membership error (409 Conflict)
      if (err.response?.status === 409) {
        toast.error('You already have an active membership for this club!');
      } else {
        toast.error('Failed to join club: ' + (err.response?.data?.message || err.message));
      }
    },
  });

  const onSubmit = data => {
    if (!selectedClub) {
      toast.error('Please select a club');
      return;
    }

    // If club has a membership fee, navigate to payment page
    if (selectedClub.membershipFee > 0) {
      navigate('/payment/club-fee', {
        state: {
          club: selectedClub,
          userEmail: data.userEmail
        }
      });
    } else {
      // For free clubs, directly create membership
      joinMutation.mutate(data);
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading clubs…</div>;
  if (isError) return <div className="text-center py-20 text-error">Error loading clubs.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 py-10">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">Join a Club</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Club Dropdown */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Club</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register('clubId', { required: true })}
                onChange={handleClubChange}
              >
                <option value="">Select a club</option>
                {clubs.map(club => (
                  <option key={club._id} value={club._id}>
                    {club.clubName}
                  </option>
                ))}
              </select>
              {errors.clubId && (
                <span className="text-error text-sm">Club selection is required</span>
              )}
            </div>

            {/* Membership Fee Info */}
            {selectedClub && (
              <div className="alert alert-success shadow-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Membership Fee: <strong>{selectedClub.membershipFee}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* User Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered w-full"
                {...register('userEmail', { required: true })}
              />
              {errors.userEmail && (
                <span className="text-error text-sm">Email is required</span>
              )}
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={joinMutation.isPending}>
                {selectedClub && selectedClub.membershipFee > 0
                  ? `Pay $${selectedClub.membershipFee} & Join`
                  : 'Join Club'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
