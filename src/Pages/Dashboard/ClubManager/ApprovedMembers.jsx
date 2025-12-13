import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import useAuth from '../../../Context/useAuth';
import toast, { Toaster } from 'react-hot-toast';

const ApprovedMembers = () => {
    const axiosInstance = useAxiosSecurity();
    const { user } = useAuth(); // If we need to filter by logged in manager
    const [searchTerm, setSearchTerm] = useState('');

    const { data: memberships = [], refetch } = useQuery({
        queryKey: ['approved-members', searchTerm],
        enabled: !!user?.email,
        queryFn: async () => {
            // Future improvement: Filter by clubs managed by current user.
            const res = await axiosInstance.get(`/memberships?status=active&search=${searchTerm}`);
            return res.data;
        }
    });

    const handleReject = async (id) => {
        try {
            const res = await axiosInstance.patch(`/memberships/${id}`, { status: 'rejected' });
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                toast.success("Member membership revoked.");
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to revoke membership.");
        }
    };

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <Toaster />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Approved Members</h2>
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        className="input input-bordered w-full max-w-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200 text-base-content">
                            <th>#</th>
                            <th>User Email</th>
                            <th>Club ID</th>
                            <th>Status</th>
                            <th>Joined At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberships.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No approved members found.
                                </td>
                            </tr>
                        ) : (
                            memberships.map((member, index) => (
                                <tr key={member._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={member.userProfile || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{member.userEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{member.clubId}</td>
                                    <td>
                                        <div className="badge badge-success text-white">Active</div>
                                    </td>
                                    <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => handleReject(member._id)}
                                            className="btn btn-sm btn-error text-white"
                                        >
                                            Revoke
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

export default ApprovedMembers;
