import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import toast, { Toaster } from 'react-hot-toast';


const ApprovedClubManagers = () => {
    const axiosInstance = useAxiosSecurity();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: managers = [], refetch } = useQuery({
        queryKey: ['approved-club-managers', searchTerm],
        queryFn: async () => {
            const res = await axiosInstance.get(`/club-managers?status=approved&search=${searchTerm}`);
            return res.data;
        }
    });
    const handleReject = async (id) => {
        try {
            const res = await axiosInstance.patch(`/club-managers/${id}`, { status: 'rejected' });
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                toast.success("Manager application rejected.");
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject manager.");
        }
    };

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <Toaster />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Approved Club Managers</h2>
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
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
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Approved At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {managers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No approved managers found.
                                </td>
                            </tr>
                        ) : (
                            managers.map((manager, index) => (
                                <tr key={manager._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={manager.photoURL || "https://via.placeholder.com/150"} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{manager.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{manager.email}</td>
                                    <td>
                                        <div className="badge badge-success text-white">Approved</div>
                                    </td>
                                    <td>{manager.approvedAt ? new Date(manager.approvedAt).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <button
                                            onClick={() => handleReject(manager._id)}
                                            className="btn btn-sm btn-error text-white"
                                        >
                                            Reject
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

export default ApprovedClubManagers;
