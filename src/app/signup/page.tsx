"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        username: "",
        password: "",
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const res = await axios.post('/api/users/signup', user);
            console.log("Signup success: ", res);
            router.push('/login');
        } catch (error: any) {
            // console.log("Signup Failed: ", error.message);
            toast.error(error.response.data.error, {
                style: {
                    padding: '15px',
                    color: 'white',
                    backgroundColor: 'rgb(214, 60, 60)',
                },
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);
    return (
        <>
            <Toaster
                position="top-left"
                reverseOrder={false}
            />
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold underline">Breaklog</h1>
                        <p className="py-6"><span className='text-2xl font-bold'>Welcome back!</span> Login or Create a new account to get started.</p>
                        <Link href="/login">Login Page</Link>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className="card-body">
                            <form>
                                <div className="form-control">
                                    <label className="label" htmlFor="username">
                                        <span className="label-text">UserName</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="username"
                                        className="input input-bordered"
                                        id="username"
                                        name="username"
                                        value={user.username}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    />
                                    {/* {errors.username && <div>{errors.username.message}</div>} */}
                                </div>
                                <div className="form-control">
                                    <label className="label" htmlFor="email">
                                        <span className="label-text">email</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="email"
                                        className="input input-bordered"
                                        id="email"
                                        name="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    />
                                    {/* {errors.email && <div>{errors.email.message}</div>} */}
                                </div>
                                <div className="form-control">
                                    <label className="label" htmlFor="password">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="password"
                                        className="input input-bordered"
                                        id="password" name="password"
                                        value={user.password}
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    />
                                    {/* {errors.password && <div>{errors.password.message}</div>} */}
                                    {/* <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label> */}
                                </div>
                                <div className="form-control mt-6">
                                    <button type='button' className={`btn btn-primary ${buttonDisabled ? "btn-disabled" : ""}`} onClick={onSignup}>
                                        Next
                                        {loading ?
                                            <>
                                                <span className="loading loading-spinner"></span>
                                            </>
                                            :
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                                </svg>
                                            </>
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}