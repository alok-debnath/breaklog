'use client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useStore } from '@/stores/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const validationSchema = Yup.object().shape({
  daily_work_required: Yup.number()
    .min(1, 'Value must be at least 1')
    .max(23, 'Value must be at most 23')
    .required('Value is required')
    .typeError('Value must be a number'),
  // default_log_mode: Yup.string().required('Default Log Mode is required'),
});

const ProfilePage = () => {
  const { userData, loading } = useStore();
  const router = useRouter();

  const initialValues = {
    daily_work_required: userData.daily_work_required,
    log_type: userData.log_type,
  };
  useEffect(() => {
    // Update form values when userData changes
    formik.setValues({
      ...formik.values,
      daily_work_required: userData.daily_work_required,
      log_type: userData.log_type,
    });
  }, [userData]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: any) {
    useStore.setState(() => ({ loading: true }));
    try {
      const res = await axios.post('/api/users/profile/updateprofile', values);

      if ((res.data.success = true)) {
        useStore.setState({
          userData: {
            ...userData,
            ...formik.values,
          },
        });
        toast.success('Data saved succesfully', {
          style: {
            padding: '15px',
            color: 'white',
            backgroundColor: 'rgb(0, 120, 0)',
          },
        });
      }
    } catch (error: any) {
      handleError({ error: error, router: router });
    } finally {
      formik.setSubmitting(false);
      useStore.setState(() => ({ loading: false }));
    }
  }

  return (
    <>
      <div className='hero min-h-screen min-w-fit bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <div className='overflow-x-auto'>
              <div className='card flex-shrink-0 w-full max-w-sm bg-base-100  my-20'>
                <form
                  onSubmit={formik.handleSubmit}
                  className='card-body grid gap-y-3 w-full max-w-xl'>
                  <h3 className='text-2xl font-bold text-left'>Update your data</h3>
                  <div className='form-control'>
                    <label
                      className='label'
                      htmlFor='daily_work_required'>
                      <span className='label-text'>Daily work hour required</span>
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      id='daily_work_required'
                      name='daily_work_required'
                      placeholder='Type here'
                      className={`input input-bordered w-full max-w-md ${
                        formik.touched.daily_work_required && formik.errors.daily_work_required
                          ? 'input-error'
                          : ''
                      }`}
                      value={formik.values.daily_work_required}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.daily_work_required && formik.errors.daily_work_required && (
                      <div className='error text-red-500 my-1 text-start'>
                        {formik.errors.daily_work_required}
                      </div>
                    )}
                  </div>
                  <div className='form-control'>
                    <label
                      className='label'
                      htmlFor='log_type'>
                      <span className='label-text'>Default Log Mode</span>
                    </label>
                    <select
                      id='log_type'
                      name='log_type'
                      className={`select select-bordered w-full max-w-xs ${
                        formik.touched.log_type && formik.errors.log_type ? 'input-error' : ''
                      }`}
                      value={formik.values.log_type}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}>
                      <option
                        value='breakmode'
                        label='Breaklog Mode'
                      />
                      <option
                        value='daymode'
                        label='Daylog Mode'
                      />
                    </select>
                    {formik.touched.log_type && formik.errors.log_type && (
                      <div className='error text-red-500 my-1 text-start'>
                        {formik.errors.log_type}
                      </div>
                    )}
                  </div>
                  <div className='form-control mt-6'>
                    <button
                      type='submit'
                      className={`btn btn-primary normal-case ${loading && 'btn-disabled'}`}>
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
