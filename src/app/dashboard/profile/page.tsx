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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const [open, setOpen] = useState(false);

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
      <div className='from-background via-background/95 to-background/90 flex min-h-screen items-center justify-center bg-gradient-to-br p-4'>
        <div className='w-full max-w-lg'>
          <div className='border-border/50 from-card/80 to-card/40 relative overflow-hidden rounded-3xl border bg-gradient-to-br shadow-2xl backdrop-blur-xl'>
            <div className='from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent' />
            <div className='relative'>
              <div className='p-8'>
                <div className='mb-6 flex items-center gap-3'>
                  <div className='rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 backdrop-blur-sm'>
                    <svg
                      className='h-6 w-6 text-blue-600 dark:text-blue-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                  </div>
                  <h1 className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-2xl font-bold'>
                    Update your data
                  </h1>
                </div>

                <TooltipProvider>
                  <form
                    onSubmit={formik.handleSubmit}
                    className='grid w-full gap-y-6'
                  >
                    <div className='grid w-full items-center gap-2'>
                      <div className='flex items-center'>
                        <Label
                          htmlFor='daily_work_required'
                          className='text-foreground/90 font-medium'
                        >
                          Daily work hour required
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className='ms-2 cursor-pointer'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='text-primary hover:text-primary/80 h-5 w-5 transition-colors'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                                />
                              </svg>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className='bg-popover/90 border-border/50 backdrop-blur-xl'>
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
                        className='bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 rounded-xl backdrop-blur-sm transition-all duration-300'
                      />
                      {formik.touched.daily_work_required &&
                        formik.errors.daily_work_required && (
                          <div className='error my-1 text-start text-sm text-red-500'>
                            {formik.errors.daily_work_required}
                          </div>
                        )}
                    </div>

                    <div className='grid w-full items-center gap-2'>
                      <div className='flex items-center'>
                        <Label
                          htmlFor='log_type'
                          className='text-foreground/90 font-medium'
                        >
                          Default Log Mode
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className='ms-2 cursor-pointer'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='text-primary hover:text-primary/80 h-5 w-5 transition-colors'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                                />
                              </svg>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className='bg-popover/90 border-border/50 backdrop-blur-xl'>
                            <p>Default Mode to use on a fresh setup.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select
                        onValueChange={(value) =>
                          formik.setFieldValue('log_type', value)
                        }
                        value={formik.values.log_type}
                      >
                        <SelectTrigger className='bg-background/50 border-border/50 hover:bg-background/70 rounded-xl backdrop-blur-sm transition-colors'>
                          <SelectValue placeholder='Log Mode' />
                        </SelectTrigger>
                        <SelectContent className='bg-popover/90 border-border/50 backdrop-blur-xl'>
                          <SelectItem
                            value='breakmode'
                            className='hover:bg-accent/50'
                          >
                            Breaklog Mode
                          </SelectItem>
                          <SelectItem
                            value='daymode'
                            className='hover:bg-accent/50'
                          >
                            Daylog Mode
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.log_type && formik.errors.log_type && (
                        <div className='error my-1 text-start text-sm text-red-500'>
                          {formik.errors.log_type}
                        </div>
                      )}
                    </div>

                    <div className='grid w-full items-center gap-2'>
                      <Label
                        htmlFor='default_time_zone'
                        className='text-foreground/90 font-medium'
                      >
                        Default Time Zone
                      </Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={open}
                            className='bg-background/50 border-border/50 hover:bg-background/70 w-full justify-between truncate rounded-xl backdrop-blur-sm transition-colors'
                          >
                            {formik.values.default_time_zone
                              ? options.find(
                                  (option) =>
                                    option.value ===
                                    formik.values.default_time_zone,
                                )?.label
                              : 'Select timezone...'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='bg-popover/90 border-border/50 w-full p-0 backdrop-blur-xl'>
                          <Command>
                            <CommandInput
                              placeholder='Search timezone...'
                              className='bg-transparent'
                            />
                            <CommandList>
                              <CommandEmpty>No timezone found.</CommandEmpty>
                              <CommandGroup>
                                {options.map((option) => (
                                  <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                      formik.setFieldValue(
                                        'default_time_zone',
                                        currentValue ===
                                          formik.values.default_time_zone
                                          ? ''
                                          : currentValue,
                                      );
                                      setOpen(false);
                                    }}
                                    className='hover:bg-accent/50'
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        formik.values.default_time_zone ===
                                          option.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {option.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {formik.touched.default_time_zone &&
                        formik.errors.default_time_zone && (
                          <div className='error my-1 text-start text-sm text-red-500'>
                            {formik.errors.default_time_zone}
                          </div>
                        )}
                    </div>

                    <Button
                      type='submit'
                      disabled={loading}
                      className='from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 mt-4 rounded-xl bg-gradient-to-r py-3 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50'
                    >
                      {loading ? (
                        <div className='flex items-center gap-2'>
                          <div className='border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2' />
                          Updating...
                        </div>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </form>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
