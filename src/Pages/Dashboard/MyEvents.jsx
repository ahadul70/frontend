import React from 'react';
import useAuth from '../../Context/useAuth';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const MyEvents = () => {
    const { user } = useAuth();
    const axiosInstance = useAxiosSecurity();


    const { data: allEvents = [] } = useQuery({
        queryKey: ['events_all'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/events');
            return data;
        }
    });

    const { data: allClubs = [] } = useQuery({
        queryKey: ['clubs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/clubs');
            return data;
        }
    });

    const { data: registrations = [], isLoading } = useQuery({
        queryKey: ['my_registrations', user?.email],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/event-registrations?email=${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });

    if (isLoading) return <div>Loading events...</div>;

    const myEvents = registrations.map(reg => {
        const event = allEvents.find(e => e._id === reg.eventId);
        const club = allClubs.find(c => c._id === reg.clubId); // assuming registration has clubId
        return { ...reg, event, club };
    });

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">My Events</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Club</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myEvents.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No events registered.</td>
                            </tr>
                        ) : (
                            myEvents.map((reg) => (
                                <tr key={reg._id}>
                                    <td>
                                        <div className="font-bold">{reg.event?.title || 'Unknown Event'}</div>
                                    </td>
                                    <td>
                                        {reg.club?.clubName || 'Unknown Club'}
                                    </td>
                                    <td>
                                        {reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td>
                                        <div className="badge badge-ghost">Registered</div>
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

export default MyEvents;
