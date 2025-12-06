import React from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../Context/useAuth'

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const { signInUser } = useAuth()

    const handleLogin = (data) => {
        console.log('after register', data)
        signInUser(data.email, data.password).then((result) => {
            const user = result.user;
            console.log(user)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        })
    }
    return (
        <>
            <form onSubmit={handleSubmit(handleLogin)}>     <fieldset className="fieldset">
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" {...register("email", { required: true })} />
                {errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>}
                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" {...register("password", { required: true, minLength: 6 })} />
                {errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>}
                {errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 characters long</p>}
                <div><a className="link link-hover">Forgot password?</a></div>
                <button className="btn btn-neutral mt-4">Login</button>
                <p>OR</p>
                <button className="btn bg-white text-black border-[#e5e5e5]">
                    <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                    Login with Google
                </button>


            </fieldset></form>
        </>
    )
}

export default Login