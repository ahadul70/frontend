import React from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../Context/useAuth'

function Reg() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { createUser } = useAuth()

    const handleregister = (data) => {
        console.log('after register', data)
        createUser(data.email, data.password).then((result) => {
            const user = result.user;
            console.log(user)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        })
    }

    return (
        <> <h1> Registration </h1>

            <form onSubmit={handleSubmit(handleregister)}>     <fieldset className="fieldset">
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" {...register("email", { required: true })} />
                {errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>}
                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" {...register("password", { required: true, minLength: 6, maxLength: 12, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ })} />
                {errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>}
                {errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 characters long</p>}
                {errors.password?.type === 'pattern' && <p className="text-red-500">Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character</p>}
                <div><a className="link link-hover">Forgot password?</a></div>
                <button className="btn btn-neutral mt-4">Registration</button>
                     <p>Already have account? <a href="/login">Login</a></p>

                <button className="btn bg-white text-black border-[#e5e5e5]">
                    <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                    Login with Google
                </button>
            </fieldset></form>

        </>
    )
}

export default Reg