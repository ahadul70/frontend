import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../Context/useAuth'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import useAxiosSecurity from '../../Context/useAxiosSecurity'
function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const { signInUser, Signinwithgoogle } = useAuth()
    const axiosInstance = useAxiosSecurity();
    const [showpass, setShowpass] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const handleshowpass = () => setShowpass(!showpass);

    const handleLogin = (data) => {
        console.log('after register', data)
        signInUser(data.email, data.password).then(async (result) => {
            const user = result.user;
            console.log(user)
            const token = await user.getIdToken();
            localStorage.setItem("token", token);
            const from = location.state?.from || "/";
            navigate(from, { replace: true });
            toast.success("🎉 Logged in successfully!");
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage)
            toast.error("Login failed. Please check your credentials.");
        })
    }

    const handleGoogleLogin = () => {
        Signinwithgoogle()
            .then(async (result) => {
                const user = result.user;
                try {
                    await axiosInstance.post("/users", {
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                    });
                } catch (error) {
                    if (error.response && error.response.status === 409) {
                        console.log("User already exists in database, skipping creation.");
                    } else {
                        console.error("Error creating user in backend:", error);
                    }
                }
                console.log('Google user:', user);
                const token = await user.getIdToken();
                localStorage.setItem("token", token);
                const from = location.state?.from || "/";
                navigate(from, { replace: true });
                toast.success("🎉 Logged in with Google successfully!");
            })
            .catch((error) => {
                console.error('Google sign-in error:', error);
                toast.error("Google sign-in failed. Please try again.");
            });
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="card w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title text-2xl justify-center mb-4">Login to Your Account</h2>
                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className="input input-bordered w-full"
                                {...register("email", { required: true })}
                            />
                            {errors.email?.type === 'required' && <p className="text-error text-sm mt-1">Email is required</p>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showpass ? "text" : "password"}
                                    placeholder="password"
                                    className="input input-bordered w-full pr-16"
                                    {...register("password", { required: true, minLength: 6 })}
                                />
                                <button
                                    type="button"
                                    onClick={handleshowpass}
                                    className="btn btn-ghost btn-sm absolute right-1 top-1/2 -translate-y-1/2 h-full"
                                >
                                    {showpass ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.password?.type === 'required' && <p className="text-error text-sm mt-1">Password is required</p>}
                            {errors.password?.type === 'minLength' && <p className="text-error text-sm mt-1">Password must be at least 6 characters long</p>}

                            <label className="label">
                                <Link to="/auth/forgotpass" className="label-text-alt link link-hover">
                                    Forgot password?
                                </Link>
                            </label>
                        </div>

                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Login</button>
                        </div>
                    </form>

                    {/* Separator and Social Login */}
                    <div className="divider">OR</div>

                    <div className="form-control">
                        <button onClick={handleGoogleLogin} type="button" className="btn btn-outline">
                            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g>
                            </svg>
                            Login with Google
                        </button>
                    </div>

                    <p className="text-center text-sm mt-4">
                        Don't have an account?
                        <Link to="/auth/registration" className="link link-hover text-primary ml-1">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login