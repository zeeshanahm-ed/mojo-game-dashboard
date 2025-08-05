import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { Checkbox, DatePicker, Divider } from 'antd';
import Extensions from './Extensions';
import CollapsibleSection from 'components/collapsible-section';
import OtherDocuments from 'pages/services/components/other-documents';
import { CASES_DATA_SUBTYPE, CASES_DATA_TYPE } from 'components/global/global';
import AddDocuments from 'pages/services/components/add-document';
import AddNotes from 'pages/services/components/add-notes';

import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import FormIcon from 'assets/icons/form-icon.svg?react';
import TabSwitcher from 'components/core-ui/tab-switcher/TabSwitcher';
import { StatusType } from 'components/global/statusConfig';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useCreateCase from '../core/hooks/useCreateCase';
import useUpdateCase from '../core/hooks/useUpdateCase';

interface DateState {
  jobHiringDate: dayjs.Dayjs | null;
  jobHiringEndDate: dayjs.Dayjs | null;
}

type CaseDataTypeKey = keyof typeof CASES_DATA_TYPE;
type CaseDataSubTypeKey = keyof typeof CASES_DATA_SUBTYPE;

function PhaseFour({ phase, serviceData, refetchCaseData, caseDocumentData, collapseAll, collapseVersion }: any) {

  // const [currentDay, setCurrentDay] = useState<Dayjs>(dayjs().startOf('day'));
  const [jobHiringPassedDays, setJobHiringPassedDays] = useState<number | null>(null);
  const [isStabilized, setIsStabilized] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(collapseAll);
  const [selectedTab, setSelectedTab] = useState(0);
  const [hirringDates, setHirringDates] = useState<DateState>({
    jobHiringDate: null,
    jobHiringEndDate: null,
  });
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const { createCaseMutate } = useCreateCase();
  const { updateCaseMutate } = useUpdateCase();
  const phaseDetailId = caseDocumentData?.["5"]?.["2"]?.["0"]?._id;


  useEffect(() => {
    setIsCollapsed(collapseAll);
  }, [collapseAll, collapseVersion]);

  useEffect(() => {
    if (caseDocumentData?.phaseDetails) {
      setHirringDates(prev => ({
        ...prev,
        jobHiringDate: caseDocumentData?.phaseDetails?.jobHiringDate
          ? dayjs(caseDocumentData?.phaseDetails?.jobHiringDate) : null,
        jobHiringEndDate: caseDocumentData?.phaseDetails?.hiringEndDate ? dayjs(caseDocumentData?.phaseDetails?.hiringEndDate) : null,
      }));
      setIsStabilized(caseDocumentData?.phaseDetails?.isStablized)
    }
  }, [caseDocumentData]);

  // Update current day at midnight
  // useEffect(() => {
  //   const now = dayjs();
  //   const updateDay = () => setCurrentDay(dayjs().startOf('day'));

  //   const msToMidnight = now.endOf('day').add(1, 'ms').diff(now);
  //   const timeout = setTimeout(() => {
  //     updateDay();
  //     setInterval(updateDay, 24 * 60 * 60 * 1000); // Every 24 hrs
  //   }, msToMidnight);

  //   return () => clearTimeout(timeout);
  // }, []);

  // Count-up logic (days passed)
  useEffect(() => {
    if (hirringDates.jobHiringDate && hirringDates.jobHiringEndDate) {
      const passed = hirringDates.jobHiringEndDate.diff(hirringDates.jobHiringDate, 'day');
      setJobHiringPassedDays(passed);
    } else {
      setJobHiringPassedDays(null);
    }
  }, [hirringDates]);


  // Helper function to reverse lookup enum key by value
  const getKeyByValue = <T extends Record<string, number>>(obj: T, value: number): keyof T | undefined => {
    return (Object.keys(obj) as (keyof T)[]).find((key) => obj[key] === value);
  };

  // Main transformation logic
  const mappedData = Object.entries(caseDocumentData || {}).reduce((acc, [typeKey, typeValue]) => {
    const numericTypeKey = parseInt(typeKey, 10);
    const typeName = getKeyByValue(CASES_DATA_TYPE, numericTypeKey);

    if (!typeName) return acc;

    acc[typeName] = Object.entries(typeValue as Record<string, any>).reduce((subAcc, [subKey, subValue]) => {
      const numericSubKey = parseInt(subKey, 10);
      const subTypeName = getKeyByValue(CASES_DATA_SUBTYPE, numericSubKey);

      if (subTypeName) {
        subAcc[subTypeName] = subValue;
      }

      return subAcc;
    }, {} as Record<CaseDataSubTypeKey, any>);

    return acc;
  }, {} as Record<CaseDataTypeKey, Record<CaseDataSubTypeKey, any>>);


  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDates(dates);
  };

  // Filter notes based on date range (dateStrings)
  const filteredNotes = mappedData?.MONTHLY_REPORTS?.NOTES?.filter((note: any) => {
    const createdAt = dayjs(note.createdAt);
    const [startDateString, endDateString] = dates
      ? [dates[0]?.format('MM-DD-YYYY'), dates[1]?.format('MM-DD-YYYY')]
      : [null, null];

    const startDate = startDateString ? dayjs(startDateString) : null;
    const endDate = endDateString ? dayjs(endDateString) : null;

    // Check if createdAt is within the selected date range
    return startDate && endDate
      ? createdAt.isAfter(startDate) && createdAt.isBefore(endDate)
      : true; // If no dates selected, return all notes
  }) || [];

  const tableHeaders = [
    { key: 'monthlyReports', label: 'Monthly Reports', condition: true },
    { key: 'notes', label: 'Notes', condition: true },
    { key: 'otherDocuments', label: 'Other Documents', condition: true },
    { key: 'extensions', label: 'Extensions', condition: true },
  ];

  // When selecting jobHiringDate
  const handleChangeJobHiringDate = (date: dayjs.Dayjs | null, type: string) => {
    if (!date) {
      setHirringDates(prev => ({ ...prev, jobHiringDate: null, jobHiringEndDate: null }));
      setJobHiringPassedDays(null);
      return;
    }

    const lastDate = date.add(45, 'day');
    setHirringDates(prev => ({
      ...prev,
      jobHiringDate: date,
      jobHiringEndDate: lastDate,
    }));

    handleUploadDate({
      jobHiringDate: date.toISOString(),
      lastDate: lastDate.toISOString(),
    }, type);
  };

  const handleUploadDate = (value: any, type: string) => {
    const payload: Record<string, any> = {};

    if (type === 'isStablized') {
      payload.isStablized = value;
      payload.status = StatusType.COMPLETED;
    } else if (type === 'jobHiringDate') {
      payload.hiringEndDate = dayjs(value.lastDate)
      payload.jobHiringDate = dayjs(value.jobHiringDate)
      payload.status = "IN_PROGRESS";
    }

    const mutationConfig = {
      onSuccess: async () => {
        refetchCaseData();
        showSuccessMessage('Documents updated successfully!');
      },
      onError: (error: any) => {
        console.error('Failed to update documents', error);
        showErrorMessage('Error while updating documents!');
      },
    };

    if (phaseDetailId) {
      updateCaseMutate({ body: payload, id: phaseDetailId }, mutationConfig);
    } else {
      let body = {
        ...payload,
        client: serviceData?.data?.client?._id,
        case: serviceData?.data?._id,
        phase: phase,
      }
      createCaseMutate(body, mutationConfig);
    }
  };

  const getDateInputUi = () => {
    return (
      <div className="mb-8 flex flex-col xl:flex-row items-start xl:items-center space-y-4 xl:space-y-0 xl:space-x-4">
        <label htmlFor="jobSearchDate" className="text-gray-700 font-medium w-40 flex-shrink-0">
          Job Continue Date
        </label>
        <div className="flex items-center border h-11 custom-radius px-2 w-full lg:w-72">
          <DatePickerIcon className="w-6 h-6 mr-2" />
          <DatePicker
            id="jobSearchDate"
            className="w-full p-2"
            value={hirringDates.jobHiringDate}
            suffixIcon={null}
            variant={"borderless"}
            onChange={(date) => handleChangeJobHiringDate(date, "jobHiringDate")}
            format="MM/DD/YYYY"
            allowClear={false}
          />
        </div>
        <span className="text-gray-500 mx-2 flex-shrink-0 flex items-center gap-4">
          <div className='w-[24px] h-[1px] bg-light-gray'></div> {jobHiringPassedDays !== null ? `${jobHiringPassedDays} Days` : 'N/A'} <div className='w-[24px] h-[1px] bg-light-gray'></div>
        </span>
        <label htmlFor="jobHiringEndDate" className="text-gray-700 font-medium w-24 flex-shrink-0">
          End Date
        </label>
        <div className="flex items-center border h-11 custom-radius px-2 w-full lg:w-72">
          <DatePickerIcon className="w-6 h-6 mr-2" />
          <DatePicker
            id="jobHiringEndDate"
            className="w-full p-2"
            value={hirringDates.jobHiringEndDate}
            suffixIcon={null}
            variant={"borderless"}
            disabled
            format="MM/DD/YYYY"
          />
        </div>
      </div>
    )
  };

  const randerTabsConteant = (selectedTab: number) => {
    switch (selectedTab) {
      case 0:
        return (
          <AddDocuments
            refetchCaseData={refetchCaseData}
            phase={phase}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.MONTHLY_REPORTS}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            icon={<FormIcon />}
            title='Monthly Reports'
            description='Click on Upload to add Monthly Reports'
            caseDocumentData={mappedData?.MONTHLY_REPORTS?.DOCUMENT || []}
          />
        )
      case 1:
        return (
          <AddNotes
            phase={phase}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.MONTHLY_REPORTS}
            caseDataSubType={CASES_DATA_SUBTYPE.NOTES}
            refetchCaseData={refetchCaseData}
            handleDateChange={handleDateChange}
            caseDocumentsNote={filteredNotes || []}
            dates={dates}
            notesData={mappedData?.MONTHLY_REPORTS?.NOTES}
          />
        )
      case 2:
        return (
          <OtherDocuments
            title='Documents'
            refetchCaseData={refetchCaseData}
            phase={phase}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.OTHER}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            description='Click on Upload to add Supporting Documents'
            supportDocument={mappedData?.OTHER?.DOCUMENT || []}
          />
        )
      case 3:
        return (
          <Extensions
            icon={<FormIcon />}
            title='Extensions'
            description='Click on Extend Days to add Extensions'
            serviceData={serviceData}
            phase={phase}
            refetchCaseData={refetchCaseData}
            caseDocumentData={mappedData?.EXTENSIONS?.DOCUMENT || []}
            caseDataType={CASES_DATA_TYPE.EXTENSIONS}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
          />
        )
      default:
        break;
    }
  };

  const handleCheckbox = (e: any) => {
    setIsStabilized(e.target.value);
    handleUploadDate(e.target.checked, "isStablized");
  };


  return (
    <CollapsibleSection
      title='PHASE 4'
      updatedDate={caseDocumentData?.["5"]?.["2"]?.["0"]?.updatedAt}
      phaseDetailId={phaseDetailId}
      collapsed={isCollapsed}
      onToggle={(val: boolean) => setIsCollapsed(val)}
      status={
        Object.values(StatusType).includes(caseDocumentData?.phaseDetails?.status as StatusType)
          ? (caseDocumentData?.phaseDetails?.status as StatusType)
          : StatusType.NOT_STARTED
      }
      phase={phase} serviceData={serviceData} refetchCaseData={refetchCaseData}
    >
      {getDateInputUi()}
      <Divider />
      <TabSwitcher tabs={tableHeaders} selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <div className='mt-8'>{randerTabsConteant(selectedTab)}</div>
      <div className='mt-8'>
        <Checkbox className='text-base' checked={isStabilized} onChange={handleCheckbox}>Stabilized for phase 4</Checkbox>
      </div>
    </CollapsibleSection>
  );
}

export default PhaseFour;
