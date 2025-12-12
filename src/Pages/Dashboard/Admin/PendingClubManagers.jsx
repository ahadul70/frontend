import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from '../../../Context/useAxiosSecurity';


const PendingClubManagers = () => {
    const axiosInstance = useAxiosSecurity();

    const { data: managers = [], refetch } = useQuery({
        queryKey: ['pending-club-managers'],
        queryFn: async () => {
            const res = await axiosInstance.get('/club-managers?status=pending');
            return res.data;
        }
    });

    const handleApprove = async (id) => {
        try {
            const res = await axiosInstance.patch(`/club-managers/${id}`, {
                status: 'approved',
                approvedAt: new Date()
            });
            if (res.data.modifiedCount > 0) {
                toast.success("Manager approved successfully!");
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve manager.");
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await axiosInstance.patch(`/club-managers/${id}`, { status: 'rejected' });
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                toast.info("Manager application rejected.");
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject manager.");
        }
    };

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <Toaster    />
            <h2 className="text-2xl font-bold mb-6 text-primary">Pending Club Managers</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* head */}
                    <thead>
                        <tr className="bg-base-200 text-base-content">
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Reason</th>
                            <th>Applied At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {managers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No pending applications found.
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
                                    <td className="max-w-xs truncate" title={manager.reason}>{manager.reason || "N/A"}</td>
                                    <td>{new Date(manager.appliedAt).toLocaleDateString()}</td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(manager._id)}
                                            className="btn btn-sm btn-success text-white"
                                        >
                                            Approve
                                        </button>
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

export default PendingClubManagers;
