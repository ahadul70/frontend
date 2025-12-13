import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Context/useAuth';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import toast from 'react-hot-toast';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosInstance = useAxiosSecurity();

    // Fetch Event Details
    const { data: event, isLoading } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/events/${id}`);
            return res.data;
        },
        enabled: !!id
    });

    const handleRegister = async () => {
        if (!user) {
            toast.error("Please login to register for events");
            navigate('/auth/login', { state: { from: location.pathname } });
            return;
        }

        if (event.isPaid && event.eventFee > 0) {
            // Paid Event: Redirect to Payment Page
            navigate('/payment/event-fee', {
                state: {
                    event: event,
                    userEmail: user.email,
                    clubId: event.clubId
                }
            });
        } else {
            // Free Event: Direct Registration
            try {
                const registrationData = {
                    userEmail: user.email,
                    eventId: event._id,
                    clubId: event.clubId,
                    status: 'registered',
                    registeredAt: new Date(),
                    eventName: event.title || event.name
                };

                const res = await axiosInstance.post('/event-registrations', registrationData);
                if (res.data.acknowledged) {
                    toast.success("Successfully registered for the event!");
                    navigate('/dashboard/my-events');
                }
            } catch (error) {
                console.error(error);
                toast.error("Registration failed.");
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!event) return <div className="p-10 text-center">Event not found</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="card lg:card-side bg-base-100 shadow-xl max-w-6xl mx-auto">
                <figure className="lg:w-1/2">
                    <img
                        src={event.image || event.clubImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                </figure>
                <div className="card-body lg:w-1/2 p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="card-title text-4xl mb-2">{event.title || event.name}</h2>
                            <p className="text-secondary font-semibold text-lg">{event.category || "General"}</p>
                        </div>
                        {event.isPaid ? (
                            <div className="badge badge-primary p-4 text-lg font-bold">${event.eventFee}</div>
                        ) : (
                            <div className="badge badge-accent p-4 text-lg font-bold">Free</div>
                        )}
                    </div>

                    <div className="divider"></div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="text-lg">{event.eventDate || event.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="text-lg">{event.location}</span>
                        </div>
                        {event.clubName && (
                             <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 5.472m0 0a17.995 17.995 0 0 1-3.896-1.125 5.002 5.002 0 0 0 5.05-5.475 5.99 5.99 0 0 1 2.742-17.556m0 0a5.99 5.99 0 0 1 2.742 17.556" />
                                </svg>
                                <span className="text-lg">Organized by: {event.clubName}</span>
                            </div>
                        )}
                    </div>

                    <div className="divider"></div>

                    <h3 className="text-2xl font-bold mb-2">About this Event</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {event.description}
                    </p>

                    <div className="card-actions justify-end mt-4">
                        <button onClick={handleRegister} className="btn btn-primary btn-lg w-full md:w-auto">
                            {event.isPaid ? 'Proceed to Payment' : 'Register Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
