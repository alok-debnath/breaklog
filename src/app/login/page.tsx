'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useStore } from '@/stores/store';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .test('valid-email', 'Invalid email address', function (value) {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
const initialValues = {
  email: '',
  password: '',
};
export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });
  interface FormValues {
    email: string;
    password: string;
  }
  function handleSubmit(values: FormValues) {
    axios
      .post('/api/auth/login', values)
      .then((res) => {
        // console.log('Login success: ', res);
        router.push('/dashboard');
      })
      .catch((error) => {
        if (error.response.data.error !== undefined) {
          toast.error(error.response.data.error, {
            style: {
              padding: '15px',
              color: 'white',
              backgroundColor: 'rgb(214, 60, 60)',
            },
          });
        } else {
          handleError({ error: error, router: null });
        }
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
  }

  const { themeMode } = useStore();
  return (
    <>
      <div data-theme={themeMode}>
        <div className='flex place-items-center justify-center min-h-dvh bg-base-200'>
          <Toaster position='top-left' reverseOrder={false} />
          <div className='hero-content w-full flex-col lg:flex-row-reverse'>
            <div className='text-center lg:text-left'>
              <h1 className='text-5xl font-bold underline'>Breaklog</h1>
              <p className='py-6'>
                <span className='text-2xl font-bold'>Welcome back!</span>{' '}
                Let&apos;t log you in to get started.
              </p>
              <p>
                Don&apos;t have an account yet?{' '}
                <Link href='/signup' className='link-hover link font-semibold'>
                  Sign up
                </Link>
              </p>
            </div>
            <div className='card max-w-sm shrink-0 bg-base-100 shadow-2xl'>
              <div className='card-body'>
                <form onSubmit={formik.handleSubmit} className='grid gap-y-2'>
                  <div className='form-control'>
                    <label className='label' htmlFor='email'>
                      <span className='label-text'>email</span>
                    </label>
                    <input
                      type='email'
                      placeholder='email'
                      className={`input ${
                        formik.touched.email && formik.errors.email
                          ? 'input-error'
                          : ''
                      }`}
                      id='email'
                      name='email'
                      value={formik.values.email.toLowerCase()}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className='error text-red-500'>
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                  <div className='form-control'>
                    <label className='label' htmlFor='password'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input
                      type='password'
                      placeholder='password'
                      className={`input ${
                        formik.touched.password && formik.errors.password
                          ? 'input-error'
                          : ''
                      }`}
                      id='password'
                      name='password'
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className='error text-red-500'>
                        {formik.errors.password}
                      </div>
                    )}
                    {/* <label className='label'>
                      <a
                        href='#'
                        className='label-text-alt link link-hover'>
                        Forgot password?
                      </a>
                    </label> */}
                  </div>
                  <div className='form-control mt-6'>
                    <button
                      type='submit'
                      className={`btn btn-primary ${
                        !formik.isValid || formik.isSubmitting
                          ? 'btn-disabled'
                          : ''
                      }`}
                    >
                      Sign in
                      {formik.isSubmitting ? (
                        <span className='loading loading-spinner'></span>
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='h-6 w-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75'
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
