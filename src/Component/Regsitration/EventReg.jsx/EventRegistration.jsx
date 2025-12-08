import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import toast from 'react-hot-toast';

export default function EventRegistration() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const axiosInstance = useAxiosSecurity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events using React Query
  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/events');
      return data;
    }
  });

  const handleEventChange = (e) => {
    const selectedEventId = e.target.value;
    const event = events.find(ev => ev._id === selectedEventId);
    setSelectedEvent(event);

    if (event) {
      setValue('clubId', event.clubId);
    } else {
      setValue('clubId', '');
    }
  };

  // Mutation for free events only (paid events go through payment page)
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // Create event registration directly (no payment needed for free events)
      const registrationData = {
        ...data,
        status: 'registered',
        paymentId: null,
        registeredAt: new Date(),
      };

      const response = await axiosInstance.post('/event-registrations', registrationData);
      if (!response.data.acknowledged) {
        throw new Error('Event registration failed');
      }
      return response;
    },
    onSuccess: () => {
      toast.success('Registered for event successfully!');
      reset();
      setSelectedEvent(null);
      setValue('clubId', '');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my_registrations'] });
    },
    onError: (err) => {
      toast.error('Failed to register: ' + (err.response?.data?.message || err.message));
    },
  });

  const onSubmit = (data) => {
    if (!selectedEvent) {
      toast.error('Please select an event');
      return;
    }

    // If event is paid, navigate to payment page
    if (selectedEvent.isPaid && selectedEvent.eventFee > 0) {
      navigate('/payment/event-fee', {
        state: {
          event: selectedEvent,
          userEmail: data.userEmail,
          clubId: data.clubId
        }
      });
    } else {
      // For free events, directly create registration
      registerMutation.mutate(data);
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading events...</div>;
  if (isError) return <div className="text-center py-20 text-error">Error loading events.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 py-10">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">Register for Event</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Event Dropdown */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Event</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register('eventId', { required: true })}
                onChange={handleEventChange}
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
              {errors.eventId && <span className="text-error text-sm">Event selection is required</span>}
            </div>

            {/* Display Fee if Paid */}
            {selectedEvent?.isPaid && selectedEvent?.eventFee > 0 && (
              <div className="alert alert-info shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>This is a paid event. Fee: <strong>${selectedEvent.eventFee}</strong></span>
                </div>
              </div>
            )}

            {/* Club ID */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Club ID (Auto-filled)</span>
              </label>
              <input
                type="text"
                placeholder="Club ID"
                className="input input-bordered w-full"
                readOnly
                {...register('clubId', { required: true })}
              />
              {errors.clubId && <span className="text-error text-sm">Club ID is required</span>}
            </div>

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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={registerMutation.isPending}
              >
                {selectedEvent?.isPaid && selectedEvent?.eventFee > 0
                  ? `Pay $${selectedEvent.eventFee} & Register`
                  : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
