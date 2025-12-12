import React from 'react';
import useAuth from '../../../Context/useAuth';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const ManageClubs = () => {
    const { user } = useAuth();
    const axiosInstance = useAxiosSecurity();

    const { data: clubs = [], isLoading } = useQuery({
        queryKey: ['my-managed-clubs', user?.email],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/clubs?email=${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });

    if (isLoading) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Manage My Clubs</h2>

            {clubs.length === 0 ? (
                <div className="text-center py-10 bg-base-100 rounded-lg shadow">
                    <p className="mb-4 text-lg">You haven't created any clubs yet.</p>
                    <Link to="/clubregister" className="btn btn-primary">Create a Club</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club) => (
                        <div key={club._id} className="card bg-base-100 shadow-xl border border-gray-100">
                            <figure className="px-4 pt-4">
                                <img src={club.bannerImage || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                                    alt={club.clubName}
                                    className="rounded-xl h-48 w-full object-cover" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {club.clubName}
                                    <div className={`badge ${club.status === 'approved' ? 'badge-success' : club.status === 'rejected' ? 'badge-error' : 'badge-warning'} text-white text-xs`}>
                                        {club.status}
                                    </div>
                                </h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    {club.description?.substring(0, 60)}...
                                </p>
                                <div className="card-actions justify-end">
                                    {/* Link to the Specific Manager Dashboard */}
                                    <Link to={`/dashboard/club-manager/${club._id}`} className="btn btn-neutral btn-sm">
                                        Open Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageClubs;
