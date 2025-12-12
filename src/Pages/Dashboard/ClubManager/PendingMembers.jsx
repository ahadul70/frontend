import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";
import useAuth from '../../../Context/useAuth';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';

const PendingMembers = () => {
    const axiosInstance = useAxiosSecurity();
    const { user } = useAuth();

    const { data: memberships = [], refetch } = useQuery({
        queryKey: ['pending-members'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosInstance.get('/memberships?status=pending');
            return res.data;
        }
    });

    const handleApprove = async (id) => {
        try {
            const res = await axiosInstance.patch(`/memberships/${id}`, { status: 'active' });
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                toast.success("Member approved successfully!");
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve member.");
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await axiosInstance.patch(`/memberships/${id}`, { status: 'rejected' });
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                toast.success("Member rejected.");
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject member.");
        }
    };

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <Toaster />
            <h2 className="text-2xl font-bold mb-6 text-primary">Pending Members</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200 text-base-content">
                            <th>#</th>
                            <th>User Email</th>
                            <th>Club ID</th>
                            <th>Joined At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberships.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No pending members found.
                                </td>
                            </tr>
                        ) : (
                            memberships.map((member, index) => (
                                <tr key={member._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>{member.userEmail}</td>
                                    <td>{member.clubId}</td>
                                    <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                                    <td className="flex gap-2">
                                        <button onClick={() => handleApprove(member._id)} className="btn btn-sm btn-success text-white">Approve</button>
                                        <button onClick={() => handleReject(member._id)} className="btn btn-sm btn-error text-white">Reject</button>
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

export default PendingMembers;
