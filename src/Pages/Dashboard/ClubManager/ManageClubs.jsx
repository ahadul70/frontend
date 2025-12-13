import React, { useState } from 'react';
import useAuth from '../../../Context/useAuth';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ManageClubs = () => {
    const { user } = useAuth();
    const axiosInstance = useAxiosSecurity();
    const { register, handleSubmit, reset, setValue } = useForm();
    const [editingClub, setEditingClub] = useState(null);

    const { data: clubs = [], isLoading, refetch } = useQuery({
        queryKey: ['my-managed-clubs', user?.email],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/clubs?email=${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });

    // Open Modal and pre-fill data
    const openEditModal = (club) => {
        setEditingClub(club);
        setValue('clubName', club.clubName);
        setValue('description', club.description);
        setValue('category', club.category);
        setValue('location', club.location);
        setValue('membershipFee', club.membershipFee);
        setValue('bannerImage', club.bannerImage);
        document.getElementById('edit_club_modal').showModal();
    };

    const onSubmit = async (data) => {
        try {
            await axiosInstance.patch(`/clubs/${editingClub._id}`, data);
            toast.success("Club updated successfully!");
            document.getElementById('edit_club_modal').close();
            setEditingClub(null);
            refetch(); // Refresh list
        } catch (error) {
            console.error("Failed to update club:", error);
            toast.error("Failed to update club details.");
        }
    };

    if (isLoading) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Manage My Clubs</h2>

            {clubs.length === 0 ? (
                <div className="text-center py-10 bg-base-100 rounded-lg shadow">
                    <p className="mb-4 text-lg">You haven't created any clubs yet.</p>
                    <Link to="/clubcreate" className="btn btn-primary">Create a Club</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club) => (
                        <div key={club._id} className="card bg-base-100 shadow-xl border border-gray-100">
                             <figure className="px-4 pt-4 relative">
                                <img src={club.bannerImage || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                                    alt={club.clubName}
                                    className="rounded-xl h-48 w-full object-cover" />
                                <button 
                                    className="btn btn-circle btn-sm absolute top-6 right-6 btn-neutral opacity-80 hover:opacity-100 tooltip tooltip-left" 
                                    data-tip="Edit Details"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openEditModal(club);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {club.clubName}
                                    <span className="badge badge-secondary text-xs">{club.category}</span>
                                </h2>
                                <div className="flex gap-2 mb-2">
                                     <span className={`badge ${club.status === 'approved' ? 'badge-success' : club.status === 'rejected' ? 'badge-error' : 'badge-warning'} text-white text-xs capitalize`}>
                                        {club.status || 'pending'}
                                    </span>
                                    <span className="badge badge-outline text-xs">${club.membershipFee || 0}/mo</span>
                                </div>
                                
                                <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden text-ellipsis">
                                    {club.description}
                                </p>
                                <div className="card-actions justify-end">
                                    {/* Link to the Specific Manager Dashboard */}
                                    <Link to={`/dashboard/club-manager/${club._id}`} className="btn btn-primary btn-outline btn-sm w-full">
                                        Open Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EDIT MODAL */}
            <dialog id="edit_club_modal" className="modal">
                <div className="modal-box w-11/12 max-w-2xl">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setEditingClub(null)}>✕</button>
                    </form>
                    <h3 className="font-bold text-2xl mb-4">Edit Club Details</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                         <div className="form-control">
                            <label className="label"><span className="label-text">Club Name</span></label>
                            <input type="text" className="input input-bordered" {...register('clubName', { required: true })} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Category</span></label>
                                <input type="text" className="input input-bordered" {...register('category', { required: true })} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Location</span></label>
                                <input type="text" className="input input-bordered" {...register('location', { required: true })} />
                            </div>
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Banner Image URL</span></label>
                            <input type="text" className="input input-bordered" {...register('bannerImage')} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Description</span></label>
                            <textarea className="textarea textarea-bordered h-24" {...register('description')}></textarea>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Membership Fee ($)</span></label>
                            <input type="number" step="0.01" className="input input-bordered" {...register('membershipFee', { min: 0 })} />
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ManageClubs;
