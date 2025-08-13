'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='grid gap-4'>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            type='text'
            placeholder='johndoe'
            id='username'
            name='username'
            value={formik.values.username.toLowerCase()}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <div className='text-sm text-red-500'>
              {formik.errors.username}
            </div>
          )}
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type='email'
            placeholder='name@example.com'
            id='email'
            name='email'
            value={formik.values.email.toLowerCase()}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='text-sm text-red-500'>
              {formik.errors.email}
            </div>
          )}
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type='password'
            placeholder='Password'
            id='password'
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className='text-sm text-red-500'>
              {formik.errors.password}
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting}
          className="w-full mt-2"
        >
          {formik.isSubmitting ? "Signing up..." : "Sign up"}
        </Button>
      </div>
    </form>
  );
}
