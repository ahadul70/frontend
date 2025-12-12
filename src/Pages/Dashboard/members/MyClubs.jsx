import React from 'react';
import useAuth from '../../../Context/useAuth';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyClubs = () => {
    const { user } = useAuth();
    const axiosInstance = useAxiosSecurity();
    const queryClient = useQueryClient();

    const { data: allClubs = [] } = useQuery({
        queryKey: ['clubs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/clubs');
            return data;
        }
    });

    const { data: memberships = [], isLoading } = useQuery({
        queryKey: ['memberships', user?.email],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/memberships?email=${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });

    // Leave Club Mutation
    const leaveClubMutation = useMutation({
        mutationFn: async (membershipId) => {
            const res = await axiosInstance.delete(`/memberships/${membershipId}`);
            if (res.data.deletedCount === 0) throw new Error("Failed to delete membership");
            return res.data;
        },
        onSuccess: () => {
            toast.success("You have left the club.");
            queryClient.invalidateQueries({ queryKey: ['memberships'] });
            queryClient.invalidateQueries({ queryKey: ['user-memberships'] });
        },
        onError: (err) => {
            toast.error("Failed to leave club: " + err.message);
        }
    });

    const handleLeaveClub = (membershipId, clubName) => {
        if (window.confirm(`Are you sure you want to leave ${clubName}?`)) {
            leaveClubMutation.mutate(membershipId);
        }
    };

    if (isLoading) return <div>Loading memberships...</div>;

    const myClubs = memberships.map(membership => {
        const club = allClubs.find(c => c._id === membership.clubId);
        return { ...membership, club };
    }).filter(item => item.club);

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">My Clubs</h2>
            {myClubs.length === 0 ? (
                <div className="text-center py-10">
                    <p className="mb-4">You haven't joined any clubs yet.</p>
                    <Link to="/clubs" className="btn btn-primary">Browse Clubs</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myClubs.map(({ _id, club, status, joinedAt }) => (
                        <div key={_id} className="card bg-base-100 shadow-xl">
                            <figure>
                                <img src={club.bannerImage || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"} alt={club.clubName} className="h-48 w-full object-cover" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {club.clubName}
                                    <div className={`badge ${status === 'active' ? 'badge-success' : 'badge-warning'} text-white`}>
                                        {status}
                                    </div>
                                </h2>
                                <p className="text-sm text-gray-500">Location: {club.location}</p>
                                <p className="text-sm">Joined: {new Date(joinedAt).toLocaleDateString()}</p>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        className="btn btn-sm btn-error text-white"
                                        onClick={() => handleLeaveClub(_id, club.clubName)}
                                        disabled={leaveClubMutation.isPending}
                                    >
                                        Leave Club
                                    </button>
                                    <Link to={`/club/${club._id}`} className="btn btn-sm btn-outline">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyClubs;
