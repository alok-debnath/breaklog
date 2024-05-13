'use client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useStore } from '@/stores/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';

const validationSchema = Yup.object().shape({
  daily_work_required: Yup.number()
    .min(1, 'Value must be at least 1')
    .max(23, 'Value must be at most 23')
    .required('Value is required')
    .typeError('Value must be a number'),
  default_time_zone: Yup.string().required('Default Timezone is required'),
  // default_log_mode: Yup.string().required('Default Log Mode is required'),
});

const ProfilePage = () => {
  const { userData, loading } = useStore();
  const router = useRouter();

  const initialValues = {
    daily_work_required: userData.daily_work_required,
    log_type: userData.log_type,
    default_time_zone: userData.default_time_zone,
  };
  useEffect(() => {
    // Update form values when userData changes
    formik.setValues({
      ...formik.values,
      daily_work_required: userData.daily_work_required,
      log_type: userData.log_type,
      default_time_zone: userData.default_time_zone,
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

  const labelStyle = 'abbrev';
  const timezones = {
    ...allTimezones,
  };
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  return (
    <>
      <div className='hero min-h-screen min-w-fit bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <div className='overflow-x-auto'>
              <div className='card my-20 w-full max-w-sm flex-shrink-0 bg-base-100'>
                <form
                  onSubmit={formik.handleSubmit}
                  className='card-body grid w-full max-w-xl gap-y-3'
                >
                  <h3 className='text-left text-2xl font-bold'>
                    Update your data
                  </h3>
                  <div className='form-control'>
                    <label className='label' htmlFor='daily_work_required'>
                      <span className='label-text flex items-center'>
                        Daily work hour required
                        <span
                          className='tooltip tooltip-top ms-2 cursor-pointer'
                          data-tip='Min work hours per day'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='me-1 h-6 w-6 text-warning'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                            />
                          </svg>
                        </span>
                      </span>
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      id='daily_work_required'
                      name='daily_work_required'
                      placeholder='Type here'
                      className={`input input-bordered w-full max-w-md ${
                        formik.touched.daily_work_required &&
                        formik.errors.daily_work_required
                          ? 'input-error'
                          : ''
                      }`}
                      value={formik.values.daily_work_required}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.daily_work_required &&
                      formik.errors.daily_work_required && (
                        <div className='error my-1 text-start text-red-500'>
                          {formik.errors.daily_work_required}
                        </div>
                      )}
                  </div>
                  <div className='form-control'>
                    <label className='label' htmlFor='log_type'>
                      <span className='label-text flex items-center'>
                        Default Log Mode
                        <span
                          className='tooltip tooltip-top ms-2 cursor-pointer'
                          data-tip='Default Mode to use on a fresh setup.'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='me-1 h-6 w-6 text-warning'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                            />
                          </svg>
                        </span>
                      </span>
                    </label>
                    <select
                      id='log_type'
                      name='log_type'
                      className={`select select-bordered w-full max-w-xs ${
                        formik.touched.log_type && formik.errors.log_type
                          ? 'input-error'
                          : ''
                      }`}
                      value={formik.values.log_type}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value='breakmode' label='Breaklog Mode' />
                      <option value='daymode' label='Daylog Mode' />
                    </select>
                    {formik.touched.log_type && formik.errors.log_type && (
                      <div className='error my-1 text-start text-red-500'>
                        {formik.errors.log_type}
                      </div>
                    )}
                  </div>
                  <div className='form-control'>
                    <label className='label' htmlFor='default_time_zone'>
                      <span className='label-text flex items-center'>
                        Default Time Zone
                      </span>
                    </label>
                    <select
                      id='default_time_zone'
                      name='default_time_zone'
                      className={`select select-bordered w-full max-w-xs ${
                        formik.touched.default_time_zone && formik.errors.default_time_zone
                          ? 'border-error'
                          : ''
                      }`}
                      value={formik.values.default_time_zone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value=''>Select a timezone</option>
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.default_time_zone &&
                      formik.errors.default_time_zone && (
                        <div className='error my-1 text-start text-red-500'>
                          {formik.errors.default_time_zone}
                        </div>
                      )}
                  </div>
                  <div className='form-control mt-6'>
                    <button
                      type='submit'
                      className={`btn btn-primary normal-case ${loading && 'btn-disabled'}`}
                    >
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
