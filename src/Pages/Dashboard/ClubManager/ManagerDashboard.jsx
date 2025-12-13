import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ManagerDashboard = () => {
    const { id } = useParams();
    const axiosInstance = useAxiosSecurity();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('overview');
    const [editingEvent, setEditingEvent] = useState(null);
    const [viewingRegistrations, setViewingRegistrations] = useState(null);

    // 1. Fetch Stats
    const { data: stats = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['manager-stats', id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/clubs/${id}/manager-stats`);
            return data;
        }
    });

    // 2. Fetch Members
    const { data: members = [], isLoading: membersLoading } = useQuery({
        queryKey: ['club-members', id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/clubs/${id}/members`);
            return data;
        },
        enabled: activeTab === 'members'
    });

    // 3. Fetch Finance
    const { data: payments = [], isLoading: financeLoading } = useQuery({
        queryKey: ['club-finance', id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/clubs/${id}/finance`);
            return data;
        },
        enabled: activeTab === 'finance'
    });

    // 4. Fetch Events
    const { data: events = [], isLoading: eventsLoading } = useQuery({
        queryKey: ['club-events', id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/events?clubId=${id}`);
            return data;
        },
        enabled: activeTab === 'events'
    });

    // Mutations
    const updateMemberStatus = useMutation({
        mutationFn: async ({ email, status }) => {
            return await axiosInstance.patch(`/clubs/${id}/members/${email}/status`, { status });
        },
        onSuccess: () => {
            toast.success("Member status updated!");
            queryClient.invalidateQueries(['club-members', id]);
            queryClient.invalidateQueries(['manager-stats', id]);
        },
        onError: (err) => toast.error("Failed to update member status")
    });

    const createEventMutation = useMutation({
        mutationFn: async (newEvent) => await axiosInstance.post('/events', { ...newEvent, clubId: id }),
        onSuccess: () => { toast.success("Event created!"); queryClient.invalidateQueries(['club-events', id]); document.getElementById('create_event_modal').close(); },
        onError: (err) => toast.error("Failed to create event")
    });

    const updateEventMutation = useMutation({
        mutationFn: async ({ eventId, data }) => await axiosInstance.put(`/events/${eventId}`, { ...data, clubId: id }),
        onSuccess: () => { toast.success("Event updated!"); queryClient.invalidateQueries(['club-events', id]); setEditingEvent(null); document.getElementById('edit_event_modal').close(); },
        onError: (err) => toast.error("Failed to update event")
    });

    const deleteEventMutation = useMutation({
        mutationFn: async (eventId) => await axiosInstance.delete(`/events/${eventId}`, { data: { clubId: id } }),
        onSuccess: () => { toast.success("Event deleted!"); queryClient.invalidateQueries(['club-events', id]); },
        onError: (err) => toast.error("Failed to delete event")
    });

    if (statsLoading) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Club Manager Dashboard</h2>
                <Link to="/dashboard/manage-clubs" className="btn btn-ghost btn-sm">← Back to Clubs</Link>
            </div>

            {/* Tabs */}
            <div role="tablist" className="tabs tabs-boxed mb-6">
                <a role="tab" className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</a>
                <a role="tab" className={`tab ${activeTab === 'members' ? 'tab-active' : ''}`} onClick={() => setActiveTab('members')}>Members</a>
                <a role="tab" className={`tab ${activeTab === 'finance' ? 'tab-active' : ''}`} onClick={() => setActiveTab('finance')}>Finance</a>
                <a role="tab" className={`tab ${activeTab === 'events' ? 'tab-active' : ''}`} onClick={() => setActiveTab('events')}>Events</a>
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-title">Total Revenue</div>
                            <div className="stat-value text-primary">${stats.revenue || 0}</div>
                        </div>
                    </div>
                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-title">Active Members</div>
                            <div className="stat-value text-secondary">{stats.members?.total || 0}</div>
                            <div className="stat-desc text-warning">{stats.members?.pending || 0} Pending Requests</div>
                        </div>
                    </div>
                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-title">Upcoming Events</div>
                            <div className="stat-value">{stats.events?.upcoming || 0}</div>
                            <div className="stat-desc">Total: {stats.events?.total || 0}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: MEMBERS */}
            {activeTab === 'members' && (
                <div className="bg-base-100 p-4 rounded-xl shadow-sm">
                    {membersLoading ? <p>Loading members...</p> : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name/Email</th>
                                        <th>Joined Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map(member => (
                                        <tr key={member._id}>
                                            <td>
                                                <div className="font-bold">{member.userName || "N/A"}</div>
                                                <div className="text-sm opacity-50">{member.userEmail}</div>
                                            </td>
                                            <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className={`badge ${member.status === 'active' ? 'badge-success' : member.status === 'pending' ? 'badge-warning' : 'badge-error'} text-white`}>
                                                    {member.status}
                                                </div>
                                            </td>
                                            <td>
                                                {member.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="btn btn-xs btn-success text-white"
                                                            onClick={() => updateMemberStatus.mutate({ email: member.userEmail, status: 'active' })}
                                                        >Approve</button>
                                                        <button
                                                            className="btn btn-xs btn-error text-white"
                                                            onClick={() => updateMemberStatus.mutate({ email: member.userEmail, status: 'rejected' })}
                                                        >Reject</button>
                                                    </div>
                                                )}
                                                {member.status === 'active' && (
                                                    <button
                                                        className="btn btn-xs btn-outline btn-error"
                                                        onClick={() => updateMemberStatus.mutate({ email: member.userEmail, status: 'rejected' })}
                                                    >Revoke</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {members.length === 0 && <p className="text-center p-4">No members found.</p>}
                        </div>
                    )}
                </div>
            )}

            {/* FINANCE */}
            {activeTab === 'finance' && (
                <div className="bg-base-100 p-4 rounded-xl shadow-sm">
                    {financeLoading ? <p>Loading transactions...</p> : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Payer</th>
                                        <th>Amount</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(pay => (
                                        <tr key={pay._id}>
                                            <td>{pay.userEmail}</td>
                                            <td className="font-mono">${pay.amount}</td>
                                            <td className="capitalize">{pay.type || "General"}</td>
                                            <td>{new Date(pay.createdAt || pay.date).toLocaleDateString()}</td>
                                            <td>
                                                <div className="badge badge-success text-white">Completed</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {payments.length === 0 && <p className="text-center p-4">No transactions found.</p>}
                        </div>
                    )}
                </div>
            )}

            {/* EVENTS */}
            {activeTab === 'events' && (
                <div className="bg-base-100 p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Club Events</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => document.getElementById('create_event_modal').showModal()}>+ Create Event</button>
                    </div>

                    {eventsLoading ? <p>Loading events...</p> : (
                        <div className="grid grid-cols-1 gap-4">
                            {events.map(event => (
                                <div key={event._id} className="card card-side bg-base-200 shadow-sm p-2 flex items-center">
                                    <div className="card-body py-2 px-4 flex-row justify-between items-center w-full">
                                        <div>
                                            <h4 className="card-title text-base">{event.eventTitle}</h4>
                                            <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} @ {event.location || 'Online'}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                className="btn btn-xs btn-outline btn-info"
                                                onClick={() => {
                                                    setViewingRegistrations(event._id);
                                                    document.getElementById('view_registrations_modal').showModal();
                                                }}
                                            >
                                                Registrations
                                            </button>
                                            <button className="btn btn-xs btn-ghost" onClick={() => {
                                                setEditingEvent(event);
                                                document.getElementById('edit_event_modal').showModal();
                                            }}>Edit</button>
                                            <button className="btn btn-xs btn-ghost text-error" onClick={() => {
                                                if (window.confirm('Delete this event?')) deleteEventMutation.mutate(event._id);
                                            }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && <p className="text-center p-4">No events created yet.</p>}
                        </div>
                    )}
                </div>
            )}

            {/* EVENT REGISTRATIONS MODAL */}
            <dialog id="view_registrations_modal" className="modal">
                <div className="modal-box w-11/12 max-w-3xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setViewingRegistrations(null)}>✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-4">Event Registrations</h3>
                    <RegistrationsList eventId={viewingRegistrations} axiosInstance={axiosInstance} />
                </div>
            </dialog>

            {/* CREATE EVENT MODAL */}
            <dialog id="create_event_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create New Event</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const newEvent = {
                            eventTitle: formData.get('eventTitle'),
                            date: formData.get('date'),
                            location: formData.get('location'),
                            description: formData.get('description'),
                            isPaid: formData.get('isPaid') === 'on',
                            eventFee: formData.get('eventFee')
                        };
                        createEventMutation.mutate(newEvent);
                    }} className="py-4 flex flex-col gap-3">
                        <input name="eventTitle" placeholder="Event Title" className="input input-bordered w-full" required />
                        <input name="date" type="date" className="input input-bordered w-full" required />
                        <input name="location" placeholder="Location" className="input input-bordered w-full" required />
                        <textarea name="description" placeholder="Description" className="textarea textarea-bordered"></textarea>
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <span className="label-text">Paid Event?</span>
                                <input type="checkbox" name="isPaid" className="checkbox" />
                            </label>
                        </div>
                        <input name="eventFee" type="number" placeholder="Fee Amount (if paid)" className="input input-bordered w-full" />
                        <div className="modal-action">
                            <button className="btn btn-primary" type="submit">Create</button>
                            <button className="btn" type="button" onClick={() => document.getElementById('create_event_modal').close()}>Cancel</button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* EDIT EVENT MODAL */}
            <dialog id="edit_event_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Event</h3>
                    {editingEvent && (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedData = {
                                eventTitle: formData.get('eventTitle'),
                                date: formData.get('date'),
                                location: formData.get('location'),
                                description: formData.get('description'),
                                isPaid: formData.get('isPaid') === 'on',
                                eventFee: formData.get('eventFee')
                            };
                            updateEventMutation.mutate({ eventId: editingEvent._id, data: updatedData });
                        }} className="py-4 flex flex-col gap-3">
                            <input name="eventTitle" defaultValue={editingEvent.eventTitle} placeholder="Event Title" className="input input-bordered w-full" required />
                            <input name="date" type="date" defaultValue={editingEvent.date?.split('T')[0]} className="input input-bordered w-full" required />
                            <input name="location" defaultValue={editingEvent.location} placeholder="Location" className="input input-bordered w-full" required />
                            <textarea name="description" defaultValue={editingEvent.description} placeholder="Description" className="textarea textarea-bordered"></textarea>
                            <div className="modal-action">
                                <button className="btn btn-primary" type="submit">Update</button>
                                <button className="btn" type="button" onClick={() => document.getElementById('edit_event_modal').close()}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};

// Sub-component for listing registrations
const RegistrationsList = ({ eventId, axiosInstance }) => {
    const { data: registrations = [], isLoading } = useQuery({
        queryKey: ['event-registrations', eventId],
        queryFn: async () => {
             if (!eventId) return [];
            const { data } = await axiosInstance.get(`/events/${eventId}/registrations`);
            return data;
        },
        enabled: !!eventId
    });

    if (isLoading) return <div className="text-center p-4"><span className="loading loading-spinner"></span></div>;

    if (registrations.length === 0) return <p className="text-center p-4">No registrations found for this event.</p>;

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>User Email</th>
                        <th>Status</th>
                        <th>Registered At</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map((reg) => (
                        <tr key={reg._id}>
                            <td>{reg.userEmail}</td>
                            <td>
                                <span className={`badge ${reg.status === 'cancelled' ? 'badge-error' : 'badge-success'} text-white capitalize`}>
                                    {reg.status || 'registered'}
                                </span>
                            </td>
                            <td>{new Date(reg.registrationDate || reg.createdAt).toLocaleDateString()} {new Date(reg.registrationDate || reg.createdAt).toLocaleTimeString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagerDashboard;
