import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from '../../../Context/useAxiosSecurity';

const ApprovedEvents = () => {
    const axiosInstance = useAxiosSecurity();

    const { data: events = [], refetch } = useQuery({
        queryKey: ['approved-events'],
        queryFn: async () => {
            const res = await axiosInstance.get('/events?status=approved');
            return res.data;
        }
    });

    const handleReject = async (id) => {
        try {
            const res = await axiosInstance.patch(`/events/${id}`, { status: 'rejected' });
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                toast.success("Event rejected/reverted.");
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject event.");
        }
    };

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <Toaster />
            <h2 className="text-2xl font-bold mb-6 text-primary">Approved Events</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200 text-base-content">
                            <th>#</th>
                            <th>Event Name</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No approved events found.
                                </td>
                            </tr>
                        ) : (
                            events.map((event, index) => (
                                <tr key={event._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            {event.image && (
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={event.image} alt="Event" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="font-bold">{event.title}</div>
                                        </div>
                                    </td>
                                    <td>{event.date}</td>
                                    <td>{event.location}</td>
                                    <td className="max-w-xs truncate" title={event.description}>{event.description}</td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleReject(event._id)}
                                            className="btn btn-sm btn-error text-white"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovedEvents;
