import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../Context/useAuth'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

function Reg() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { createUser, updateUserProfile, Signinwithgoogle } = useAuth()  // added Signinwithgoogle
    const [showpass, setShowpass] = useState(false)
    const [photoURL, setPhotoURL] = useState("")
    const navigate = useNavigate()
    const location = useLocation()

    const handleshowpass = () => setShowpass(!showpass)

    const handleregister = (data) => {
        createUser(data.email, data.password)
            .then((result) => {
                const user = result.user
                // Update profile with name + photoURL
                updateUserProfile(data.name, photoURL)
                    .then(() => {
                        toast.success("🎉 Registration successful! Redirecting...")
                        const from = location.state?.from || "/"
                        setTimeout(() => {
                            navigate(from, { replace: true })
                        }, 1500)
                    })
                    .catch((error) => {
                        console.error("Profile update error", error)
                        toast.success("Account created, but profile update failed.")
                        navigate("/", { replace: true })
                    })
            })
            .catch((error) => {
                const errorMessage = error.message
                toast.error("Registration failed: " + (errorMessage.split('(')[0] || errorMessage))
            })
    }

    const handleGoogleSignIn = () => {
        if (!Signinwithgoogle) {
            toast.error("Google Sign-In not available.")
            return
        }
        Signinwithgoogle()
            .then((result) => {
                const user = result.user
                toast.success(`Welcome ${user.displayName || "User"}!`)
                const from = location.state?.from || "/"
                navigate(from, { replace: true })
            })
            .catch((error) => {
                console.error("Google sign-in error:", error)
                toast.error("Google Sign-In failed. Please try again.")
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="card w-full max-w-sm shadow-2xl bg-base-100 p-6 relative">
                <div className="flex justify-center -mt-16 mb-4">
                    {photoURL ? (
                        <img
                            src={photoURL}
                            alt="Avatar Preview"
                            className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-gray-400 font-semibold">
                            Avatar
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit(handleregister)} className="space-y-4">
                    <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

                    <label className="label">Full Name</label>
                    <input
                        type="text"
                        className="input input-bordered w-full mb-2"
                        placeholder="Name"
                        {...register("name", { required: true })}
                    />
                    {errors.name && <span className="text-error text-sm">Name is required</span>}

                    <label className="label">Image URL (Optional)</label>
                    <input
                        type="text"
                        className="input input-bordered w-full mb-2"
                        placeholder="Paste image URL"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                    />
                    <a
                        href="https://postimages.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm mb-2 inline-block"
                    >
                        Upload here (Postimages.org)
                    </a>

                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input input-bordered w-full mb-2"
                        placeholder="Email"
                        {...register("email", { required: true })}
                    />
                    {errors.email && <span className="text-error text-sm">Email is required</span>}

                    <label className="label">Password</label>
                    <div className="relative">
                        <input
                            type={showpass ? "text" : "password"}
                            className="input input-bordered w-full pr-16 mb-2"
                            placeholder="Password"
                            {...register("password", {
                                required: true,
                                minLength: 6,
                                maxLength: 12,
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/,
                            })}
                        />
                        <button
                            type="button"
                            onClick={handleshowpass}
                            className="btn btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            {showpass ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password?.type === 'required' && <span className="text-error text-sm">Password is required</span>}
                    {errors.password?.type === 'minLength' && <span className="text-error text-sm">Minimum 6 characters</span>}
                    {errors.password?.type === 'maxLength' && <span className="text-error text-sm">Maximum 12 characters</span>}
                    {errors.password?.type === 'pattern' && <span className="text-error text-xs">Must include uppercase, lowercase, number, and special character</span>}
                    <button type="submit" className="btn btn-neutral w-full mt-4">Register</button>
                </form>

                <div className="divider">OR</div>

                <button
                    onClick={handleGoogleSignIn}
                    className="btn flex items-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100 transition-all w-full"
                >
                    <svg aria-label="Google logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <g>
                            <path fill="#fff" d="M0 0h512v512H0z" />
                            <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
                            <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
                            <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
                            <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
                        </g>
                    </svg>
                    <span>Sign Up with Google</span>
                </button>

                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="link link-hover text-blue-500">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Reg
