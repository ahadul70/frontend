import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../Context/useAuth';  
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAxiosSecurity from '../../Context/useAxiosSecurity';

export default function ClubCreate() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const axiosInstance = useAxiosSecurity();

  const { user } = useAuth(); // Get user from auth context
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("You must be logged in to create a club");
      return;
    }

    const clubData = {
      ...data,
      userEmail: user.email,
      userName: user.displayName,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axiosInstance.post('/clubs', clubData);
      if (response.data.insertedId || response.data.acknowledged) {
        toast.success('Club created successfully! Pending approval.');
        reset();
        navigate('/dashboard/manage-clubs'); // Redirect to manager dashboard
      }
    } catch (error) {
      console.error("Error creating club:", error);
      if (error.response && error.response.status === 409) {
        toast.error("Club with this name already exists");
      } else {
        toast.error('Failed to create club');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">Create Your Club</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Club Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Club Name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register('clubName', { required: true })}
              />
              {errors.clubName && <span className="text-error text-sm">Club Name is required</span>}
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Bio"
                {...register('description')}
              ></textarea>
            </div>

            {/* Category */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <input
                type="text"
                placeholder="Tech, Sports, Art, etc."
                className="input input-bordered w-full"
                {...register('category', { required: true })}
              />
              {errors.category && <span className="text-error text-sm">Category is required</span>}
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                placeholder="City or Area"
                className="input input-bordered w-full"
                {...register('location', { required: true })}
              />
              {errors.location && <span className="text-error text-sm">Location is required</span>}
            </div>

            {/* Banner Image */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Banner Image URL</span>
              </label>
              <input
                type="text"
                placeholder="https://..."
                className="input input-bordered w-full"
                {...register('bannerImage')}
              />
              <a
                        href="https://postimages.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm mb-2 inline-block"
                    >
                        Upload here (Postimages.org)
                    </a>
            </div>

            {/* Membership Fee */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Membership Fee</span>
              </label>
              <input
                type="number"
                placeholder="0 for free"
                className="input input-bordered w-full"
                {...register('membershipFee', { min: 0 })}
              />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Create Club</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
