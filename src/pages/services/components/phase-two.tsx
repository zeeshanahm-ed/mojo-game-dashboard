import { DatePicker, Divider } from 'antd';

import CollapsibleSection from 'components/collapsible-section';
import { CASES_DATA_SUBTYPE, CASES_DATA_TYPE } from 'components/global/global';
import dayjs, { Dayjs } from 'dayjs';
import AddDocuments from 'pages/services/components/add-document';
import AddNotes from 'pages/services/components/add-notes';
import OtherDocuments from 'pages/services/components/other-documents';

import FormIcon from 'assets/icons/form-icon.svg?react';
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';

import { useEffect, useState } from 'react';
import TabSwitcher from 'components/core-ui/tab-switcher/TabSwitcher';
import { StatusType } from 'components/global/statusConfig';
import useCreateCase from '../core/hooks/useCreateCase';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useUpdateCase from '../core/hooks/useUpdateCase';

function PhaseTwo({ phase, serviceData, refetchCaseData, caseDocumentData, collapseAll, collapseVersion }: any) {
  const [isCollapsed, setIsCollapsed] = useState(collapseAll);
  const { createCaseMutate } = useCreateCase();
  const { updateCaseMutate } = useUpdateCase();
  const [selectedTab, setSelectedTab] = useState(0);
  const [phasesDates, setPhasesDates] = useState<{ jobSearchDate: Dayjs | null }>({
    jobSearchDate: null,
  })
  const [jobHiringPassedDays] = useState<number | null>(45);
  // const [currentDay, setCurrentDay] = useState(dayjs().startOf('day'));
  const phaseDetailId = caseDocumentData?.["5"]?.["2"]?.["0"]?._id;


  useEffect(() => {
    setIsCollapsed(collapseAll);
  }, [collapseAll, collapseVersion]);

  useEffect(() => {
    if (caseDocumentData?.phaseDetails) {
      setPhasesDates(prev => ({
        ...prev,
        jobSearchDate: caseDocumentData?.phaseDetails?.jobSearchDate
          ? dayjs(caseDocumentData?.phaseDetails?.jobSearchDate) : null,
      }));
    }
  }, [caseDocumentData]);

  // Count-up logic (days passed)
  // useEffect(() => {
  //   if (phasesDates.jobSearchDate) {
  //     const passed = currentDay.diff(phasesDates.jobSearchDate, 'day');
  //     setJobHiringPassedDays(passed >= 45 ? 45 : Math.max(passed, 0)); // Stop at 45
  //   } else {
  //     setJobHiringPassedDays(null);
  //   }
  // }, [phasesDates, currentDay]);

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


  // Ensure caseDocumentData is an object or provide an empty object if it's not available
  const mappedData = Object.keys(caseDocumentData || {}).reduce((acc: any, key) => {
    // Convert the string key to a number
    const numericKey = parseInt(key, 10);

    // Find the matching key from the CASES_DATA_TYPE enum
    const matchingTypeKey = Object.keys(CASES_DATA_TYPE).find(
      (enumKey) => CASES_DATA_TYPE[enumKey as keyof typeof CASES_DATA_TYPE] === numericKey
    ) as keyof typeof CASES_DATA_TYPE | undefined;

    // If a matching type is found, assign it to the new object
    if (matchingTypeKey) {
      acc[matchingTypeKey] = Object.keys(caseDocumentData[key]).reduce(
        (innerAcc: any, subKey) => {
          // Find the matching key from the CASES_DATA_SUBTYPE enum
          const caseDataSubType = parseInt(subKey, 10);
          const matchingSubTypeKey = Object.keys(CASES_DATA_SUBTYPE).find(
            (enumSubKey) =>
              CASES_DATA_SUBTYPE[enumSubKey as keyof typeof CASES_DATA_SUBTYPE] === caseDataSubType
          ) as keyof typeof CASES_DATA_SUBTYPE | undefined;

          // If a matching subtype is found, assign the data to the correct key
          if (matchingSubTypeKey) {
            innerAcc[matchingSubTypeKey] = caseDocumentData[key][subKey];
          }

          return innerAcc;
        },
        {}
      );
    }

    return acc;
  }, {});

  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);

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

  const handlePhasesDateChange = (date: any, type: string) => {
    setPhasesDates(prev => ({ ...prev, [type]: date }));
    handleUploadDate(date, type);
  };

  const handleUploadDate = (value: any, type: string) => {
    const payload: Record<string, any> = {};

    if (type === 'jobSearchDate') {
      payload.jobSearchDate = dayjs(value).toISOString();
      payload.status = StatusType.IN_PROGRESS;
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
      <div className='flex items-center mb-10 gap-x-8'>
        <div className="flex items-center">
          <label className="text-left text-light-gray font-medium pr-4 text-nowrap">Job Searching Date :</label>
          <div className="flex flex-1 items-center border h-11 custom-radius px-2">
            <DatePickerIcon className="w-6 h-6 mr-2" />
            <DatePicker
              value={phasesDates.jobSearchDate}
              suffixIcon={null}
              variant={"borderless"}
              onChange={(e) => handlePhasesDateChange(e, "jobSearchDate")}
              format="MM/DD/YYYY"
              placeholder='MM/DD/YYYY'
              className="flex-1 w-full p-2"
              allowClear={false}
            />
          </div>
        </div>
        <div>
          <div>
            <div className=' flex items-center justify-between'>
              <h3 className="text-light-gray">Job Searching Duration : </h3>
              <span className="text-black text-nowrap ml-1">{jobHiringPassedDays !== null ? `${jobHiringPassedDays} Days` : "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    )
  };

  const tableHeaders = [
    { key: 'monthlyReports', label: 'Monthly Reports', condition: true },
    { key: 'notes', label: 'Notes', condition: true },
    { key: 'evfForms', label: 'EVF Forms', condition: true },
    { key: 'otherDocuments', label: 'Other Documents', condition: true },
  ];

  const randerTabsConteant = (selectedTab: number) => {
    switch (selectedTab) {
      case 0:
        return (
          <AddDocuments
            phase={phase}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.MONTHLY_REPORTS}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            refetchCaseData={refetchCaseData}
            icon={<FormIcon />}
            title='Monthly Reports'
            description='Click on Upload to add Monthly Reports'
            caseDocumentData={mappedData?.MONTHLY_REPORTS?.DOCUMENT || []}
          />
        )
      case 1:
        return (
          <>
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
          </>
        )
      case 2:
        return (
          <AddDocuments
            refetchCaseData={refetchCaseData}
            phase={phase}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.EVF_FORMS}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            icon={<FormIcon />}
            title='EVF Form'
            description='Click on Upload to add EVF Form'
            caseDocumentData={mappedData?.EVF_FORMS?.DOCUMENT || []}
          />
        )
      case 3:
        return (
          <OtherDocuments
            title='Documents'
            phase={phase}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.OTHER}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            refetchCaseData={refetchCaseData}
            description='Click on Upload to add Supporting Documents'
            supportDocument={mappedData?.OTHER?.DOCUMENT || []}
          />
        )
      default:
        break;
    }
  };


  return (

    <CollapsibleSection
      title='PHASE 2'
      phaseDetailId={phaseDetailId}
      updatedDate={caseDocumentData?.["5"]?.["2"]?.["0"]?.updatedAt}
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
    </CollapsibleSection>

  );
}

export default PhaseTwo;
