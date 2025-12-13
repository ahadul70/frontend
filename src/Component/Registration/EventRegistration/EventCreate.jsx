import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import toast from 'react-hot-toast';

export default function EventCreate() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const axiosInstance = useAxiosSecurity();
  const isPaid = watch('isPaid');
  const [clubs, setClubs] = useState([]);

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



  const onSubmit = async (data) => {
    try {
      const selectedClub = clubs.find(c => c._id === data.clubId);
      const eventData = {
        ...data,
        clubName: selectedClub?.clubName,
        clubImage: selectedClub?.bannerImage // Optional, if you want valid image
      };
      
      const response = await axiosInstance.post('/events', eventData);
      if (response.data.acknowledged) {
        alert('Event created successfully!');
        reset();
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert('Failed to create event');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 py-10">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">Create New Event</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Club Dropdown */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Club</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register('clubId', { required: true })}
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

            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Event Title</span>
              </label>
              <input
                type="text"
                placeholder="Event Title"
                className="input input-bordered w-full"
                {...register('title', { required: true })}
              />
              {errors.title && <span className="text-error text-sm">Title is required</span>}
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Event Details"
                {...register('description')}
              ></textarea>
            </div>

            {/* Event Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Event Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register('eventDate', { required: true })}
              />
              {errors.eventDate && <span className="text-error text-sm">Date is required</span>}
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                placeholder="Venue"
                className="input input-bordered w-full"
                {...register('location', { required: true })}
              />
              {errors.location && <span className="text-error text-sm">Location is required</span>}
            </div>

            {/* Is Paid */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <span className="label-text">Is this a paid event?</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register('isPaid')}
                />
              </label>
            </div>

            {/* Event Fee (Conditional) */}
            {isPaid && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Event Fee</span>
                </label>
                <input
                  type="number"
                  placeholder="Amount"
                  className="input input-bordered w-full"
                  {...register('eventFee', { required: true, min: 0 })}
                />
                {errors.eventFee && <span className="text-error text-sm">Fee is required for paid events</span>}
              </div>
            )}

            {/* Max Attendees */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Max Attendees (Optional)</span>
              </label>
              <input
                type="number"
                placeholder="Limit"
                className="input input-bordered w-full"
                {...register('maxAttendees', { min: 1 })}
              />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Create Event</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
