import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import useAxiosSecurity from '../../Context/useAxiosSecurity';

const Events = () => {
    const axiosInstance = useAxiosSecurity();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');

    const { data: events = [], isLoading } = useQuery({
        queryKey: ['events', search, sort],
        queryFn: async () => {
            const params = new URLSearchParams({ status: 'approved' });
            if (search) params.append('search', search);
            if (sort) params.append('sort', sort);
            
            const res = await axiosInstance.get(`/events?${params.toString()}`);
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-infinity loading-lg text-secondary"></span></div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-10 text-secondary">Upcoming Events</h1>

            {/* Filter & Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10 text-center max-w-4xl mx-auto bg-base-100 p-4 rounded-xl shadow-sm">
                <div className="form-control w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="input input-bordered w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select 
                    className="select select-bordered w-full md:w-auto"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="">Sort By</option>
                    <option value="date:asc">Date: Upcoming First</option>
                    <option value="date:desc">Date: Latest First</option>
                    <option value="eventTitle:asc">Name: A-Z</option>
                </select>
            </div>

            {events.length === 0 ? (
                <div className="text-center text-gray-500 text-xl">No upcoming events matching your criteria.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div key={event._id} className="card bg-base-100 shadow-xl border-l-4 border-secondary hover:shadow-2xl transition-all duration-300">
                            {event.image && (
                                <figure className="h-48 overflow-hidden">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </figure>
                            )}
                            <div className="card-body">
                                <h2 className="card-title text-2xl">{event.title}</h2>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {event.date}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {event.location}
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                                <div className="card-actions justify-end">
                                    <Link to={`/event/${event._id}`} className="btn btn-secondary btn-outline btn-sm">Learn More</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
