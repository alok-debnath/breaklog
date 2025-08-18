'use client';
import axios from 'axios';
import { useStore } from '@/stores/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  handleError,
  handleSuccessToast,
} from '@/components/common/CommonCodeBlocks';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

  const initialValues = useMemo(
    () => ({
      daily_work_required: userData.daily_work_required,
      log_type: userData.log_type,
      default_time_zone: userData.default_time_zone,
    }),
    [userData],
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    console.log('userData', userData);
  }, [userData]);


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
        handleSuccessToast({
          message: 'Data saved successfully',
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
      <div className='bg-background flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-md'>
              <Card className="w-full shrink-0">
                <CardHeader>
                  <CardTitle>Update your data</CardTitle>
                </CardHeader>
                <CardContent>
                  <TooltipProvider>
                    <form
                      onSubmit={formik.handleSubmit}
                      className='grid w-full gap-y-4'
                    >
                      <div className="grid w-full items-center gap-1.5">
                        <div className="flex items-center">
                          <Label htmlFor="daily_work_required">Daily work hour required</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className='ms-2 cursor-pointer'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth={1.5}
                                  stroke='currentColor'
                                  className='text-warning me-1 h-6 w-6'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                                  />
                                </svg>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Min work hours per day</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          type='number'
                          step='0.01'
                          id='daily_work_required'
                          name='daily_work_required'
                          placeholder='Type here'
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

                      <div className="grid w-full items-center gap-1.5">
                        <div className="flex items-center">
                          <Label htmlFor="log_type">Default Log Mode</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className='ms-2 cursor-pointer'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth={1.5}
                                  stroke='currentColor'
                                  className='text-warning me-1 h-6 w-6'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                                  />
                                </svg>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Default Mode to use on a fresh setup.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      <Select onValueChange={(value) => formik.setFieldValue('log_type', value)} value={formik.values.log_type}>
                        <SelectTrigger>
                          <SelectValue placeholder="Log Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakmode">Breaklog Mode</SelectItem>
                          <SelectItem value="daymode">Daylog Mode</SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.log_type && formik.errors.log_type && (
                        <div className='error my-1 text-start text-red-500'>
                          {formik.errors.log_type}
                        </div>
                      )}
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="default_time_zone">Default Time Zone</Label>
                      <Select onValueChange={(value) => formik.setFieldValue('default_time_zone', value)} value={formik.values.default_time_zone}>
                        <SelectTrigger className="w-full truncate">
                          <SelectValue placeholder="Timezone" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {options.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.default_time_zone &&
                        formik.errors.default_time_zone && (
                          <div className='error my-1 text-start text-red-500'>
                            {formik.errors.default_time_zone}
                          </div>
                        )}
                    </div>
                    <Button
                      type='submit'
                      disabled={loading}
                      className="mt-3 normal-case"
                    >
                      Update
                    </Button>
                    </form>
                  </TooltipProvider>
                </CardContent>
              </Card>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
