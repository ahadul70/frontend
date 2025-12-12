import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import useAuth from '../../Context/useAuth';

const ClubDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxiosSecurity();
    const { user } = useAuth();

    const {
        data: club,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['club', id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/clubs/${id}`);
            return data;
        },
    });

    // Check if user already has membership
    const { data: memberships = [] } = useQuery({
        queryKey: ['user-memberships', user?.email],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/memberships?email=${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });

    const hasActiveMembership = memberships.some(
        m => m.clubId === id && m.status === 'active'
    );

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (isError || !club) return <div className="text-center py-20">Club not found.</div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="card lg:card-side bg-base-100 shadow-xl">
                <figure className="lg:w-1/2">
                    {club.bannerImage ? (
                        <img src={club.bannerImage} alt={club.clubName} className="w-full h-96 object-cover" />
                    ) : (
                        <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Club" className="w-full h-96 object-cover" />
                    )}
                </figure>
                <div className="card-body lg:w-1/2">
                    <h2 className="card-title text-4xl mb-4">
                        {club.clubName}
                        <div className="badge badge-secondary text-lg p-3">{club.category}</div>
                    </h2>
                    <p className="flex-grow-0 text-gray-600 mb-4">{club.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="stat place-items-start p-0">
                            <div className="stat-title">Membership Fee</div>
                            <div className="stat-value text-primary text-2xl">
                                {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}
                            </div>
                        </div>
                        <div className="stat place-items-start p-0">
                            <div className="stat-title">Location</div>
                            <div className="stat-value text-secondary text-lg whitespace-normal">{club.location}</div>
                        </div>
                    </div>

                    {/* Membership Status Alert */}
                    {hasActiveMembership && (
                        <div className="alert alert-success mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>You are already a member of this club!</span>
                        </div>
                    )}

// ... inside the return statement ...

<div className="card-actions justify-end mt-auto">
    <Link to="/" className="btn btn-outline">Back to Clubs</Link>
    {hasActiveMembership ? (
        <button className="btn btn-disabled" disabled>
            Already a Member
        </button>
    ) : (
        <Link 
            to="/join-club" 
            state={{ clubId: club._id }} 
            className="btn btn-primary"
        >
            Join Club
        </Link>
    )}
</div>
                </div>
            </div>
        </div>
    );
};

export default ClubDetails;
