import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Context/useAuth';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import toast, { Toaster } from 'react-hot-toast';

const MemberProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosInstance = useAxiosSecurity();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (user) {
            setValue('name', user.displayName);
            setValue('photoURL', user.photoURL);
            setValue('email', user.email);
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        try {
            // 1. Update in Backend Database
            const res = await axiosInstance.patch(`/users/${user.email}`, {
                name: data.name,
                photoURL: data.photoURL
            });

            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                // 2. Update Firebase Profile (Client-side sync)
                await updateUserProfile(data.name, data.photoURL);
                toast.success('Profile updated successfully!');
            } else {
                toast.success('Profile saved (No changes detected).');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile.');
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-base-100 rounded-xl shadow-md">
            <Toaster />
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">Edit Profile</h2>

            <div className="flex justify-center mb-8">
                <div className="avatar">
                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="Profile" />
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email (Cannot be changed)</span>
                    </label>
                    <input
                        type="email"
                        {...register('email')}
                        disabled
                        className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Full Name</span>
                    </label>
                    <input
                        type="text"
                        {...register('name', { required: "Name is required" })}
                        className="input input-bordered w-full"
                    />
                    {errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Photo URL</span>
                    </label>
                    <input
                        type="text"
                        {...register('photoURL')}
                        className="input input-bordered w-full"
                        placeholder="https://example.com/photo.jpg"
                    />
                    <div className="label">
                        <span className="label-text-alt text-gray-400">Paste a direct image link</span>
                    </div>
                </div>

                <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary w-full">Update Profile</button>
                </div>
            </form>
        </div>
    );
};

export default MemberProfile;
