"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from "formik";
import * as Yup from 'yup';
// import { sendEmail } from "@/helpers/mailer";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .test('valid-email', 'Invalid email address', function (value) {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        }),
    username: Yup.string()
        .matches(/^[a-zA-Z0-9]*$/, 'Username must contain only letters and numbers')
        .min(4, 'Username must be at least 4 characters')
        .required('Username is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});
const initialValues = {
    email: "",
    username: "",
    password: "",
};
export default function SignupPage() {
    const router = useRouter();

    const [savedTheme, setSavedTheme] = useState("");
    // To Perform localStorage action on the client side after the window is loaded
    useEffect(() => {
        if (localStorage.getItem("thememode") !== null) {
            setSavedTheme(localStorage.getItem('thememode')!);
        }
    }, [])

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    async function handleSubmit(values: any) {
        try {
            const res = await axios.post('/api/users/signup', values);
            // alert(res.data.data.id);
            // console.log("Signup success: ", res);

            // send email
            // await sendEmail({ email: values.email, emailType: "VERIFY", userID: res.data.data.id })
            if (res.data.success = true) {
                router.push('/login');
            }
        } catch (error: any) {
            if (error.response.data.error !== undefined) {
                toast.error(error.response.data.error, {
                    style: {
                        padding: '15px',
                        color: 'white',
                        backgroundColor: 'rgb(214, 60, 60)',
                    },
                });
            } else {
                toast.error(error.message, {
                    style: {
                        padding: '15px',
                        color: 'white',
                        backgroundColor: 'rgb(214, 60, 60)',
                    },
                });
            }
        } finally {
            formik.setSubmitting(false);
        }
    }
    return (
        <>
            <div className="hero min-h-screen bg-base-200" data-theme={savedTheme}>
                <Toaster
                    position="top-left"
                    reverseOrder={false}
                />
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold underline">Breaklog</h1>
                        <p className="py-6"><span className='text-2xl font-bold'>Welcome!</span> Create a new account to get started.</p>
                        <p>Already have an account? <Link href="/login" className="font-semibold link link-hover">Login</Link></p>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className="card-body">
                            <form onSubmit={formik.handleSubmit}>
                                <div className="form-control">
                                    <label className="label" htmlFor="username">
                                        <span className="label-text">UserName</span>
                                    </label>
                                    <input
                                        type="username"
                                        placeholder="username"
                                        className={`input input-bordered ${formik.touched.username && formik.errors.username ? "input-error" : ""}`}
                                        id="username"
                                        name="username"
                                        value={formik.values.username.toLowerCase()}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.username && formik.errors.username && <div className="error text-red-500 my-1">{formik.errors.username}</div>}
                                </div>
                                <div className="form-control">
                                    <label className="label" htmlFor="email">
                                        <span className="label-text">email</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="email"
                                        className={`input input-bordered ${formik.touched.email && formik.errors.email ? "input-error" : ""}`}
                                        id="email"
                                        name="email"
                                        value={formik.values.email.toLowerCase()}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.email && formik.errors.email && <div className="error text-red-500 my-1">{formik.errors.email}</div>}
                                </div>
                                <div className="form-control">
                                    <label className="label" htmlFor="password">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="password"
                                        className={`input input-bordered ${formik.touched.password && formik.errors.password ? "input-error" : ""}`}
                                        id="password"
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.password && formik.errors.password && <div className="error text-red-500 my-1">{formik.errors.password}</div>}
                                </div>
                                <div className="form-control mt-6">
                                    <button type='submit' className={`btn btn-primary ${!formik.isValid || formik.isSubmitting ? "btn-disabled" : ""}`}>
                                        Next
                                        {formik.isSubmitting ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                            </svg>
                                        )}
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