import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecurity from '../../Context/useAxiosSecurity';

export default function ClubJoin() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const axiosInstance = useAxiosSecurity();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axiosInstance.get('/clubs');
        setClubs(response.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, [axiosInstance]);

  const handleClubChange = (e) => {
    const selectedClubId = e.target.value;
    const club = clubs.find(c => c._id === selectedClubId);
    setSelectedClub(club);
  };

  const onSubmit = async (data) => {
    try {
      let paymentId = null;

      // 1. Process Payment if fee > 0
      if (selectedClub && selectedClub.membershipFee > 0) {
        const paymentData = {
          userEmail: data.userEmail,
          amount: selectedClub.membershipFee,
          type: 'membership',
          clubId: selectedClub._id,
          status: 'completed' // Mocking successful payment
        };
        const paymentResponse = await axiosInstance.post('/payments', paymentData);
        if (paymentResponse.data.insertedId) {
             paymentId = paymentResponse.data.insertedId;
        } else {
             throw new Error("Payment failed");
        }
      }

      // 2. Create Membership
      const membershipData = {
        userEmail: data.userEmail,
        clubId: selectedClub._id,
        status: 'active',
        paymentId: paymentId,
        joinedAt: new Date(),
      };

      const membershipResponse = await axiosInstance.post('/memberships', membershipData);
      
      if (membershipResponse.data.acknowledged) {
        alert(`Successfully joined ${selectedClub.clubName}!`);
        reset();
        setSelectedClub(null);
      }

    } catch (error) {
      console.error("Error joining club:", error);
      alert('Failed to join club. ' + error.message);
    }
  };

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
                {clubs.map((club) => (
                    <option key={club._id} value={club._id}>
                        {club.clubName}
                    </option>
                ))}
              </select>
              {errors.clubId && <span className="text-error text-sm">Club selection is required</span>}
            </div>

            {/* Membership Fee Info */}
            {selectedClub && (
              <div className="alert alert-success shadow-lg">
                <div>
                   <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <span>Membership Fee: <strong>${selectedClub.membershipFee}</strong></span>
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
              {errors.userEmail && <span className="text-error text-sm">Email is required</span>}
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                {selectedClub && selectedClub.membershipFee > 0 ? `Pay $${selectedClub.membershipFee} & Join` : 'Join Club'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
