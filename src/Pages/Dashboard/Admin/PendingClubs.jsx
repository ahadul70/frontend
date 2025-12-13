import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from '../../../Context/useAxiosSecurity';

const PendingClubs = () => {
    const axiosInstance = useAxiosSecurity();

    const { data: clubs = [], refetch } = useQuery({
        queryKey: ['pending-clubs'],
        queryFn: async () => {
            const res = await axiosInstance.get('/clubs?status=pending');
            return res.data;
        }
    });

    const handleApprove = async (id) => {
        try {
            const res = await axiosInstance.patch(`/clubs/${id}`, { status: 'approved' });
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                toast.success("Club approved successfully!");
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve club.");
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await axiosInstance.patch(`/clubs/${id}`, { status: 'rejected' });
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                toast.success("Club rejected.");
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject club.");
        }
    };

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <Toaster />
            <h2 className="text-2xl font-bold mb-6 text-primary">Pending Clubs</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200 text-base-content">
                            <th>#</th>
                            <th>Club Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No pending clubs found.
                                </td>
                            </tr>
                        ) : (
                            clubs.map((club, index) => (
                                <tr key={club._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={club.bannerImage || "https://via.placeholder.com/150"} alt="Club" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{club.clubName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="max-w-xs truncate" title={club.description}>{club.description}</td>
                                    <td>{club.category}</td>
                                    <td className="flex gap-2">
                                        <button onClick={() => handleApprove(club._id)} className="btn btn-sm btn-success text-white">Approve</button>
                                        <button onClick={() => handleReject(club._id)} className="btn btn-sm btn-error text-white">Reject</button>
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

export default PendingClubs;
