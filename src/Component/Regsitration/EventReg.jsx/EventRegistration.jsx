import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecurity from './useAxiosSecurity';

export default function EventRegistration() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const axiosInstance = useAxiosSecurity();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [axiosInstance]);

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

  const onSubmit = async (data) => {
    try {
        let paymentId = null;

        // 1. Process Payment if event is paid
        if (selectedEvent && selectedEvent.isPaid) {
            const paymentData = {
                userEmail: data.userEmail,
                amount: selectedEvent.eventFee,
                type: 'event',
                eventId: selectedEvent._id,
                clubId: selectedEvent.clubId,
                status: 'completed' // Mocking successful payment
            };
            const paymentResponse = await axiosInstance.post('/payments', paymentData);
            if (paymentResponse.data.insertedId) {
                paymentId = paymentResponse.data.insertedId;
            } else {
                throw new Error("Payment failed");
            }
        }

        // 2. Register for Event
        const registrationData = {
            ...data,
            status: 'registered',
            paymentId: paymentId,
            registeredAt: new Date(),
        };

        const response = await axiosInstance.post('/event-registrations', registrationData);
        if (response.data.acknowledged) {
            alert(selectedEvent?.isPaid ? 'Payment successful! Registered for event.' : 'Registered for event successfully!');
            reset();
            setSelectedEvent(null);
            setValue('clubId', ''); // Clear club ID
        }
    } catch (error) {
        console.error("Error registering for event:", error);
        alert('Failed to register');
    }
  };

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
            {selectedEvent?.isPaid && (
              <div className="alert alert-info shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
              <button type="submit" className="btn btn-primary">
                {selectedEvent?.isPaid ? 'Payment' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
