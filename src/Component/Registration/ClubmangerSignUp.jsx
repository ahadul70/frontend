import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../Context/useAuth';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ClubmangerSignUp = () => {
    const { user } = useAuth();
    const axiosInstance = useAxiosSecurity();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const applicationData = {
                name: data.name,
                email: data.email,
                reason: data.reason,
                photoURL: user?.photoURL || ''
            };

            await axiosInstance.post('/club-managers', applicationData);

            console.log("Form submitted with data:", applicationData);
            toast.success("Application submitted successfully! (Pending Admin Approval)");
            navigate('/');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 409) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to submit application.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <Toaster />
            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="text-3xl font-bold text-center mb-6">Club Manager Registration</h2>
                    <p className="text-center text-gray-500 mb-6">
                        Apply to become a Club Manager. Your request will be reviewed by an administrator.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={user?.displayName || ''}
                                className="input input-bordered w-full"
                                {...register("name", { required: true })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                defaultValue={user?.email || ''}
                                className="input input-bordered w-full"
                                {...register("email", { required: true })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Reason for Application (Optional)</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                placeholder="Tell us why you want to manage a club..."
                                {...register("reason")}
                            ></textarea>
                        </div>

                        <div className="form-control mt-6">
                            <button className="btn btn-primary w-full">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClubmangerSignUp;
