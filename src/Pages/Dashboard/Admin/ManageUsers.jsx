import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import toast, { Toaster } from 'react-hot-toast';

const ManageUsers = () => {
    const axiosInstance = useAxiosSecurity();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortRole, setSortRole] = useState(false); // Toggle sort

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users', searchTerm],
        queryFn: async () => {
            const res = await axiosInstance.get(`/users?search=${searchTerm}`);
            return res.data;
        }
    });

    // Sort Logic
    const sortedUsers = [...users].sort((a, b) => {
        if (!sortRole) return 0; // No sort
        const roleHierarchy = { 'super_admin': 1, 'club_manager': 2, 'member': 3 };
        return (roleHierarchy[a.role] || 3) - (roleHierarchy[b.role] || 3);
    });

    const updateUserMutation = useMutation({
        mutationFn: async ({ id, role, status }) => {
            const res = await axiosInstance.patch(`/users/admin/${id}`, { role, status });
            return res.data;
        },
        onSuccess: () => {
            toast.success("User updated successfully");
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (err) => {
            toast.error("Failed to update user: " + (err.response?.data?.message || err.message));
        }
    });

    const handleRoleChange = (user, newRole) => {
        if (window.confirm(`Are you sure you want to promote/demote ${user.name} to ${newRole}?`)) {
            updateUserMutation.mutate({ id: user._id, role: newRole });
        }
    };

    const handleStatusChange = (user, newStatus) => {
        const action = newStatus === 'banned' ? 'BAN' : 'ACTIVATE';
        if (window.confirm(`Are you sure you want to ${action} ${user.name}?`)) {
            updateUserMutation.mutate({ id: user._id, status: newStatus });
        }
    };

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <Toaster />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Manage Users</h2>
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
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions (Role)</th>
                            <th>Actions (Status)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                        ) : sortedUsers.length === 0 ? (
                            <tr><td colSpan="5" className="text-center">No users found.</td></tr>
                        ) : (
                            sortedUsers.map((user) => (
                                <tr key={user._id} className="hover">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={user.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-sm opacity-50">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge ${user.role === 'super_admin' ? 'badge-primary' : user.role === 'club_manager' ? 'badge-secondary' : 'badge-ghost'}`}>
                                            {user.role || 'member'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge ${user.status === 'banned' ? 'badge-error' : 'badge-success'} text-white`}>
                                            {user.status || 'active'}
                                        </div>
                                    </td>

                                    {/* Role Actions */}
                                    <td className="space-x-2">
                                        {user.role !== 'super_admin' && (
                                            <button
                                                className="btn btn-xs btn-outline btn-primary"
                                                onClick={() => handleRoleChange(user, 'super_admin')}
                                            >
                                                Make Admin
                                            </button>
                                        )}
                                        {user.role !== 'club_manager' && (
                                            <button
                                                className="btn btn-xs btn-outline btn-secondary"
                                                onClick={() => handleRoleChange(user, 'club_manager')}
                                            >
                                                Make Manager
                                            </button>
                                        )}
                                        {user.role !== 'member' && (
                                            <button
                                                className="btn btn-xs btn-outline"
                                                onClick={() => handleRoleChange(user, 'member')}
                                            >
                                                Demote
                                            </button>
                                        )}
                                    </td>

                                    {/* Status Actions */}
                                    <td>
                                        {user.status === 'banned' ? (
                                            <button
                                                className="btn btn-xs btn-success text-white"
                                                onClick={() => handleStatusChange(user, 'active')}
                                            >
                                                Unban
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-xs btn-error text-white"
                                                onClick={() => handleStatusChange(user, 'banned')}
                                            >
                                                Ban
                                            </button>
                                        )}
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

export default ManageUsers;
