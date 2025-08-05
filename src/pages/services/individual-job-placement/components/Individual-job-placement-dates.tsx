import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';

import useUpdateServiceAssign from 'pages/services/core/hooks/useUpdateServiceAssign';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { useHandleIJPDates } from 'store/IJP_Dates';



interface DateState {
    jobSearchDate: dayjs.Dayjs | null;
    jobSearchEndDate: dayjs.Dayjs | null;
    jobHiringDate: dayjs.Dayjs | null;
    jobHiringLastDate: dayjs.Dayjs | null;
}

interface IndividualJobPlacementDatesProps {
    serviceData: any;
    refetch: any;
}

const IndividualJobPlacementDates: React.FC<IndividualJobPlacementDatesProps> = ({ refetch, serviceData }) => {
    const { mutate } = useUpdateServiceAssign();
    const { setAllDates } = useHandleIJPDates();

    const [hirringDates, setHirringDates] = useState<DateState>({
        jobSearchDate: null,
        jobSearchEndDate: null,
        jobHiringDate: null,
        jobHiringLastDate: null,
    });


    const [jobSearchPassedDays, setJobSearchPassedDays] = useState<number | null>(null);
    const [jobHiringPassedDays, setJobHiringPassedDays] = useState<number | null>(null);
    // const [currentDay, setCurrentDay] = useState(dayjs().startOf('day'));

    // Update current day at midnight
    // useEffect(() => {
    //     const now = dayjs();
    //     const updateDay = () => setCurrentDay(dayjs().startOf('day'));

    //     const msToMidnight = now.endOf('day').add(1, 'ms').diff(now);
    //     const timeout = setTimeout(() => {
    //         updateDay();
    //         setInterval(updateDay, 24 * 60 * 60 * 1000); // Every 24 hrs
    //     }, msToMidnight);

    //     return () => clearTimeout(timeout);
    // }, []);

    // Load data into state
    useEffect(() => {
        if (serviceData) {
            const jobSearch = serviceData?.data?.jobSearchDate ? dayjs(serviceData.data.jobSearchDate) : null;
            const jobSearchEnd = serviceData?.data?.EndDate ? dayjs(serviceData?.data?.EndDate) : null;

            const jobHiring = serviceData?.data?.jobHiringDate ? dayjs(serviceData.data.jobHiringDate) : null;
            const jobHiringLast = serviceData?.data?.lastDate ? dayjs(serviceData?.data?.lastDate) : null;

            setHirringDates({
                jobSearchDate: jobSearch,
                jobSearchEndDate: jobSearchEnd,
                jobHiringDate: jobHiring,
                jobHiringLastDate: jobHiringLast,
            });
            setAllDates({
                jobSearchDate: jobSearch,
                jobSearchEndDate: jobSearchEnd,
                jobHiringDate: jobHiring,
                jobHiringLastDate: jobHiringLast,
            });
        }
    }, [serviceData]);

    useEffect(() => {
        // Handle Job Search Passed Days
        if (hirringDates.jobSearchDate && hirringDates.jobSearchEndDate) {
            const passed = hirringDates.jobSearchEndDate.diff(hirringDates.jobSearchDate, 'day');
            setJobSearchPassedDays(passed);
        } else {
            setJobSearchPassedDays(null);
        }

        if (hirringDates.jobHiringDate && hirringDates.jobHiringLastDate) {
            const passed = hirringDates.jobHiringLastDate.diff(hirringDates.jobHiringDate, 'day');
            setJobHiringPassedDays(passed);
        } else {
            setJobHiringPassedDays(null);
        }
    }, [hirringDates]);

    const handleDateApiChange = (data: any) => {
        mutate(
            { id: serviceData?.data?._id, data },
            {
                onSuccess: () => {
                    showSuccessMessage('Date added Successfully');
                    refetch({}, serviceData?.data?._id);
                },
                onError: (error: any) => {
                    showErrorMessage('Failed to add date');
                    console.error('Update error:', error);
                },
            }
        );
    };

    const handleJobSearchDate = (date: dayjs.Dayjs | null) => {
        if (!date) {
            setHirringDates(prev => ({ ...prev, jobSearchDate: null, jobSearchEndDate: null }));
            setJobSearchPassedDays(null);
            return;
        }

        const endDate = date.add(45, 'day');
        setHirringDates(prev => ({
            ...prev,
            jobSearchDate: date,
            jobSearchEndDate: endDate,
        }));
        setAllDates({
            jobSearchDate: date,
            jobSearchEndDate: endDate,
        });

        handleDateApiChange({
            jobSearchDate: date.toISOString()?.split("T")[0],
            EndDate: endDate.toISOString()?.split("T")[0],
        });
    };

    const handleJobHiringDate = (date: dayjs.Dayjs | null) => {
        if (!date) {
            setHirringDates(prev => ({ ...prev, jobHiringDate: null, jobHiringLastDate: null }));
            setJobHiringPassedDays(null);
            return;
        }

        const lastDate = date.add(90, 'day');
        setHirringDates(prev => ({
            ...prev,
            jobHiringDate: date,
            jobHiringLastDate: lastDate,
        }));
        setAllDates({
            jobHiringDate: date,
            jobHiringLastDate: lastDate,
        });

        handleDateApiChange({
            jobHiringDate: date.toISOString()?.split("T")[0],
            lastDate: lastDate.toISOString()?.split("T")[0],
        });
    };


    return (
        <div className="py-6 px-0 mb-10">
            {/* Job Search Date Row */}
            <div className="mb-8 flex flex-col xl:flex-row items-start xl:items-center justify-between space-y-4 xl:space-y-0 xl:space-x-4">
                <label htmlFor="jobSearchDate" className="text-gray-700 font-medium w-40 flex-shrink-0">
                    Job Search Date
                </label>
                <div className="flex items-center border custom-radius h-11 px-2 w-full lg:w-72">
                    <DatePickerIcon className="w-6 h-6 mr-2" />
                    <DatePicker
                        id="jobSearchDate"
                        className="w-full p-2"
                        value={hirringDates.jobSearchDate}
                        suffixIcon={null}
                        variant={"borderless"}
                        onChange={(date) => handleJobSearchDate(date)}
                        format="MM/DD/YYYY"
                        allowClear={false}
                    />
                </div>
                <span className="text-gray-500 mx-2 flex-shrink-0 w-[110px]">
                    — {jobSearchPassedDays !== null ? `${jobSearchPassedDays} Days` : 'N/A'} —
                </span>
                <label htmlFor="jobSearchEndDate" className="text-gray-700 font-medium w-24 flex-shrink-0">
                    End Date
                </label>
                <div className="flex items-center border custom-radius px-2 h-11 w-full lg:w-72">
                    <DatePickerIcon className="w-6 h-6 mr-2" />
                    <DatePicker
                        id="jobSearchEndDate"
                        className="w-full p-2"
                        value={hirringDates.jobSearchEndDate}
                        suffixIcon={null}
                        variant={"borderless"}
                        disabled
                        format="MM/DD/YYYY"
                    />
                </div>
            </div>

            {/* Job Hiring Date Row */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between space-y-4 xl:space-y-0 xl:space-x-4">
                <label htmlFor="jobHiringDate" className="text-gray-700 font-medium w-40 flex-shrink-0">
                    Job Hiring Date
                </label>
                <div className="flex items-center border custom-radius h-11 px-2 w-full lg:w-72">
                    <DatePickerIcon className="w-6 h-6 mr-2" />
                    <DatePicker
                        id="jobHiringDate"
                        className="w-full p-2"
                        value={hirringDates.jobHiringDate}
                        suffixIcon={null}
                        variant={"borderless"}
                        onChange={(date) => handleJobHiringDate(date)}
                        format="MM/DD/YYYY"
                        allowClear={false}
                    />
                </div>
                <span className="text-gray-500 mx-2 flex-shrink-0  w-[110px]">
                    — {jobHiringPassedDays !== null ? `${jobHiringPassedDays} Days` : 'N/A'} —
                </span>
                <label htmlFor="jobHiringLastDate" className="text-gray-700 font-medium w-24 flex-shrink-0">
                    Last Date
                </label>
                <div className="flex items-center border custom-radius h-11 px-2 w-full lg:w-72">
                    <DatePickerIcon className="w-6 h-6 mr-2" />
                    <DatePicker
                        id="jobHiringLastDate"
                        className="w-full p-2"
                        value={hirringDates.jobHiringLastDate}
                        suffixIcon={null}
                        variant={"borderless"}
                        disabled
                        format="MM/DD/YYYY"
                    />
                </div>
            </div>
        </div>
    )
}

export default IndividualJobPlacementDates