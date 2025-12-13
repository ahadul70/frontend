import React from 'react';
import { Link } from 'react-router-dom';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ClubCards = ({ filters = {} }) => {
    const axiosInstance = useAxiosSecurity();

    const {
        data: clubs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['clubs', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.sort) params.append('sort', filters.sort);

            const { data } = await axiosInstance.get(`/clubs?${params.toString()}`);
            return data;
        },
    });

    if (isLoading) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (isError) {
        toast.error('Failed to load clubs');
        return <div className="text-center py-20 text-error">Error loading clubs.</div>;
    }

    return (
        <div className="container mx-auto pb-10">
            {clubs.length === 0 ? (
                <div className="text-center py-10">
                    <h3 className="text-xl font-semibold">No clubs found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club) => (
                        <Link
                            to={`/club/${club._id}`}
                            key={club._id}
                            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border border-base-200"
                        >
                            <figure>
                                {club.bannerImage ? (
                                    <img
                                        src={club.bannerImage}
                                        alt={club.clubName}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                        alt="Club"
                                        className="h-48 w-full object-cover"
                                    />
                                )}
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {club.clubName}
                                    <div className="badge badge-secondary text-xs">{club.category}</div>
                                </h2>
                                <p className="text-sm text-gray-500 line-clamp-2">{club.description}</p>
                                <div className="card-actions justify-end mt-4 items-center">
                                    {club.membershipFee > 0 ? (
                                        <div className="badge badge-primary badge-outline font-bold">${club.membershipFee}/yr</div>
                                    ) : (
                                        <div className="badge badge-accent badge-outline font-bold">Free</div>
                                    )}
                                    <div className="text-xs text-gray-400">{new Date(club.createdAt || Date.now()).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClubCards;
