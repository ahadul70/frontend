import React, { useState } from 'react';
import useAuth from '../../Context/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPass = () => {
    const { forgotPass } = useAuth();
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await forgotPass(email);
            toast.success("Password reset email sent! Check your inbox.");
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error("Failed to send reset email. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-base-200">
            <div className="card w-full max-w-sm shadow-2xl bg-base-100">
                <form onSubmit={handleReset} className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
                    <p className="text-center text-gray-500 mb-4">Enter your email to receive reset instructions.</p>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="email" 
                            className="input input-bordered" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-control mt-6">
                        <button className="btn btn-primary">Send Reset Link</button>
                    </div>

                    <div className="divider">OR</div>

                    <div className="text-center">
                        <Link to="/login" className="link link-hover text-sm">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPass;