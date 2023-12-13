'use client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useStore } from '@/stores/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useRouter } from 'next/navigation';

const validationSchema = Yup.object().shape({
  work_required: Yup.number()
    .min(1, 'Value must be at least 1')
    .max(23, 'Value must be at most 23')
    .required('Value is required')
    .typeError('Value must be a number'),
});

const ProfilePage = () => {
  const { userData } = useStore();
  const router = useRouter();

  const initialValues = {
    work_required: userData.dailyWorkRequired,
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: any) {
    try {
      const res = await axios.post('/api/users/signup', values);

      if ((res.data.success = true)) {
        toast.success('Data saved succesfully', {
          style: {
            padding: '15px',
            color: 'white',
            backgroundColor: 'rgb(214, 60, 60)',
          },
        });
      }
    } catch (error: any) {
      handleError({ error: error, router: router });
    } finally {
      formik.setSubmitting(false);
    }
  }

  return (
    <>
      <div className='hero min-h-screen min-w-fit bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <div className='overflow-x-auto'>
              <div className='card flex-shrink-0 w-full max-w-sm bg-base-100  my-20'>
                <form className='card-body grid gap-y-3 w-full max-w-xl'>
                  <h3 className='text-2xl font-bold text-left'>Update your data</h3>
                  <div className='form-control'>
                    <label
                      className='label'
                      htmlFor='work_required'>
                      <span className='label-text'>Daily work hour required</span>
                    </label>
                    <input
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      id='work_required'
                      name='work_required'
                      placeholder='Type here'
                      className={`input input-bordered w-full max-w-md ${
                        formik.touched.work_required && formik.errors.work_required
                          ? 'input-error'
                          : ''
                      }`}
                      value={formik.values.work_required}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.work_required && formik.errors.work_required && (
                      <div className='error text-red-500 my-1 text-start'>
                        {formik.errors.work_required}
                      </div>
                    )}
                  </div>
                  <div className='form-control mt-6'>
                    <button
                      type='button'
                      className='btn btn-primary normal-case'>
                      Update
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
};

export default ProfilePage;
