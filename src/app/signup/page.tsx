'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useStore } from '@/stores/store';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
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
  email: '',
  username: '',
  password: '',
};
export default function SignupPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: any) {
    try {
      const res = await axios.post('/api/auth/signup', values);

      // send email
      // await sendEmail({ email: values.email, emailType: "VERIFY", userID: res.data.data.id })
      if ((res.data.success = true)) {
        router.push('/login');
      }
    } catch (error: any) {
      if (error.response.data.error !== undefined) {
        handleError({
          error: { message: error.response.data.error },
          router: router,
        });
        if (error.response.data.focusOn.length > 0) {
          error.response.data.focusOn.forEach((field: string) => {
            formik.setFieldError(field, `Change ${field}`);
          });
        }
      } else {
        handleError({ error: error, router: null });
      }
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
                <p className='text-2xl font-bold'>Sign up</p>
              </div>
              <p className='py-2'>
                Already have an account?{' '}
                <Link href='/login' className='link-hover link font-semibold'>
                  Login
                </Link>
              </p>
            </div>
            <div className='card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl'>
              <div className='card-body'>
                <form onSubmit={formik.handleSubmit}>
                  <fieldset className='fieldset grid gap-y-3'>
                    <div>
                      <legend className='fieldset-label'>UserName</legend>
                      <input
                        type='username'
                        placeholder='username'
                        className={`input ${
                          formik.touched.username && formik.errors.username
                            ? 'input-error'
                            : ''
                        }`}
                        id='username'
                        name='username'
                        value={formik.values.username.toLowerCase()}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.username && formik.errors.username && (
                        <div className='error text-red-500'>
                          {formik.errors.username}
                        </div>
                      )}
                    </div>
                    <div>
                      <legend className='fieldset-label'>email</legend>
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
                      <legend className='fieldset-label'>Password</legend>
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
                      <p>Your password will be encrypted</p>
                      {formik.touched.password && formik.errors.password && (
                        <div className='error text-red-500'>
                          {formik.errors.password}
                        </div>
                      )}
                      {/* <GoogleSignInButton text='Sign up with Google' /> */}
                    </div>
                    <button
                      type='submit'
                      className={`btn btn-primary mt-4 ${
                        !formik.isValid || formik.isSubmitting
                          ? 'btn-disabled'
                          : ''
                      }`}
                    >
                      Next
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
