'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useStore } from '@/stores/store';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { signIn } from 'next-auth/react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

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
  async function handleSubmit(values: FormValues) {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!res) {
        // signIn() failed unexpectedly (network or internal error)
        handleError({
          error: { message: 'Unexpected error. Please try again' },
          router: router,
        });
      } else if (res.ok && !res.error) {
        router.push('/dashboard');
      } else {
        // Invalid credentials or handled failure
        handleError({
          error: {
            message:
              //  res.error ||
              'Invalid credentials',
          },
          router: router,
        });
      }
    } catch (error: any) {
      console.error('SignIn exception:', error);
      handleError({
        error: { message: 'An unexpected error occurred' },
        router: router,
      });
    } finally {
      formik.setSubmitting(false);
    }
  }

  const { themeMode } = useStore();
  return (
    <>
      <div data-theme={themeMode || 'caramellatte'}>
        <div className='hero bg-base-200 min-h-screen'>
          <Toaster position='top-left' reverseOrder={false} />
          <div className='hero-content flex-col lg:flex-row-reverse'>
            <div className='text-center lg:text-left'>
              <div className='mb-3 flex flex-row items-center gap-4'>
                <h1 className='text-5xl font-bold underline'>Breaklog</h1>
                <p className='text-2xl font-bold'>Login</p>
              </div>
              <p className='py-2'>
                Don&apos;t have an account yet?{' '}
                <Link href='/signup' className='link-hover link font-semibold'>
                  Sign up
                </Link>
              </p>
            </div>
            <div className='card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl'>
              <div className='card-body p-0'>
                <div className='tabs tabs-box'>
                  <input
                    type='radio'
                    name='my_tabs_3'
                    className='tab'
                    aria-label='Traditional login'
                    defaultChecked
                  />
                  <div className='tab-content bg-base-100 border-base-300 rounded-lg p-6'>
                    <form onSubmit={formik.handleSubmit}>
                      <fieldset className='fieldset grid gap-y-3'>
                        <div>
                          <legend className='fieldset-legend'>email</legend>
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
                        <div>
                          <legend className='fieldset-legend'>Password</legend>
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
                          {formik.touched.password &&
                            formik.errors.password && (
                              <div className='error text-red-500'>
                                {formik.errors.password}
                              </div>
                            )}
                          {/* <div><a className="link link-hover">Forgot password?</a></div> */}
                        </div>
                        <button
                          type='submit'
                          className={`btn btn-primary mt-4 ${
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
                      </fieldset>
                    </form>
                  </div>

                  <input
                    type='radio'
                    name='my_tabs_3'
                    className='tab'
                    aria-label='OAuth login'
                  />
                  <div className='tab-content bg-base-100 border-base-300 rounded-lg p-6'>
                    <GoogleSignInButton text='Sign in with Google' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
