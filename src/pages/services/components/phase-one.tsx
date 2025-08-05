import { Checkbox, DatePicker, Divider } from 'antd';
import CollapsibleSection from 'components/collapsible-section';
import { CASES_DATA_SUBTYPE, CASES_DATA_TYPE } from 'components/global/global';
import dayjs, { Dayjs } from 'dayjs';
import AddDocuments from 'pages/services/components/add-document';
import AddNotes from 'pages/services/components/add-notes';
import OtherDocuments from 'pages/services/components/other-documents';
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import FormIcon from 'assets/icons/form-icon.svg?react';
import { useEffect, useState } from 'react';
import TabSwitcher from 'components/core-ui/tab-switcher/TabSwitcher';
import { StatusType } from 'components/global/statusConfig';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useCreateCase from '../core/hooks/useCreateCase';
import useUpdateCase from '../core/hooks/useUpdateCase';
import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { useQueryClient } from 'react-query';
import useUpdateServiceAssign from '../core/hooks/useUpdateServiceAssign';

function PhaseOne({ phase, serviceData, refetchCaseData, caseDocumentData, collapseAll, collapseVersion }: any) {
  const [isCollapsed, setIsCollapsed] = useState<any>(collapseAll);
  const { createCaseMutate } = useCreateCase();
  const { updateCaseMutate } = useUpdateCase();
  const { mutate: updateServiceAssign } = useUpdateServiceAssign();
  const queryClient = useQueryClient();


  const phaseDetailId = caseDocumentData?.["5"]?.["2"]?.["0"]?._id;
  const [phasesDates, setPhasesDates] = useState<{
    meetingDate: Dayjs | null;
    deadlineDate: Dayjs | null;
    isMeetingConducted: boolean;
  }>({
    meetingDate: null,
    deadlineDate: null,
    isMeetingConducted: false
  })

  useEffect(() => {
    setIsCollapsed(collapseAll);
  }, [collapseAll, collapseVersion]);

  useEffect(() => {
    if (caseDocumentData?.phaseDetails) {
      setPhasesDates(prev => ({
        ...prev,
        meetingDate: caseDocumentData?.phaseDetails?.meetingDate
          ? dayjs(caseDocumentData?.phaseDetails?.meetingDate) : null,
        isMeetingConducted: caseDocumentData?.phaseDetails?.isMeetingConducted,
        deadlineDate: caseDocumentData?.phaseDetails?.deadlineDate
          ? dayjs(caseDocumentData?.phaseDetails?.deadlineDate)
          : null,
      }));
    }
  }, [caseDocumentData]);

  const mappedData = Object.keys(caseDocumentData || {}).reduce((acc: any, key) => {
    const numericKey = parseInt(key, 10);

    const matchingTypeKey = Object.keys(CASES_DATA_TYPE).find(
      (enumKey) => CASES_DATA_TYPE[enumKey as keyof typeof CASES_DATA_TYPE] === numericKey
    ) as keyof typeof CASES_DATA_TYPE | undefined;
    if (matchingTypeKey) {
      acc[matchingTypeKey] = Object.keys(caseDocumentData[key]).reduce((innerAcc: any, subKey) => {
        // Find the matching key from the CASES_DATA_SUBTYPE enum
        const caseDataSubType = parseInt(subKey, 10);
        const matchingSubTypeKey = Object.keys(CASES_DATA_SUBTYPE).find(
          (enumSubKey) => CASES_DATA_SUBTYPE[enumSubKey as keyof typeof CASES_DATA_SUBTYPE] === caseDataSubType
        ) as keyof typeof CASES_DATA_SUBTYPE | undefined;

        // If a matching subtype is found, assign the data to the correct key
        if (matchingSubTypeKey) {
          innerAcc[matchingSubTypeKey] = caseDocumentData[key][subKey];
        }

        return innerAcc;
      }, {});
    }

    return acc;
  }, {});

  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDates(dates);
  };

  // Filter notes based on date range (dateStrings)
  const filteredNotes = mappedData?.SIGNED_REPORTS?.NOTES?.filter((note: any) => {
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
    { key: 'signedReports', label: 'Signed Reports' },
    { key: 'notes', label: 'Notes' },
    { key: 'otherDocuments', label: 'Other Documents' },
  ];

  const handleUploadDate = (value: any, type: string) => {
    const payload: Record<string, any> = {};
    if (type === 'meetingDate') {
      payload.meetingDate = dayjs(value.meetingDate).toISOString();
      payload.deadlineDate = dayjs(value.deadlineDate).toISOString();
      payload.status = StatusType.IN_PROGRESS;
      handleService()
    } else if (type === 'meetingConducted') {
      payload.isMeetingConducted = value;
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

  const handleService = async () => {
    const body = {
      status: 2,
    };
    try {
      await updateServiceAssign(
        { id: serviceData?.data?._id, data: body },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(QUERIES_KEYS.GET_SERVICE);
          },
          onError: (error: any) => {
            console.error('Status update error', error);
          },
        }
      );

    } catch (error) {
      console.error('Error updating service assignment:', error);
    }
  };

  const randerTabsConteant = (selectedTab: number) => {
    switch (selectedTab) {
      case 0:
        return (
          <AddDocuments
            phase={phase}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.SIGNED_REPORTS}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            refetchCaseData={refetchCaseData}
            icon={<FormIcon />}
            title='Signed Reports'
            description='Click on Upload to add Reports'
            caseDocumentData={mappedData?.SIGNED_REPORTS?.DOCUMENT || []}
          />
        )
      case 1:
        return (
          <>
            <AddNotes
              phase={phase}
              serviceData={serviceData}
              caseDataType={CASES_DATA_TYPE.SIGNED_REPORTS}
              caseDataSubType={CASES_DATA_SUBTYPE.NOTES}
              refetchCaseData={refetchCaseData}
              caseDocumentsNote={filteredNotes || []}
              handleDateChange={handleDateChange}
              dates={dates}
              notesData={mappedData?.SIGNED_REPORTS?.NOTES}
            />
          </>
        )
      case 2:
        return (
          <OtherDocuments
            phase={phase}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.OTHER}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            refetchCaseData={refetchCaseData}
            title='Documents'
            description='Click on Upload to add Supporting Documents'
            supportDocument={mappedData?.OTHER?.DOCUMENT || []}
          />
        )
      default:
        break;
    }
  };

  const handlePhasesDateChange = (date: dayjs.Dayjs | null, type: string) => {
    if (!date) {
      setPhasesDates(prev => ({ ...prev, meetingDate: null, deadlineDate: null }));
      return;
    }

    const endDate = date.add(5, 'day');
    setPhasesDates(prev => ({
      ...prev,
      meetingDate: date,
      deadlineDate: endDate,
    }));

    handleUploadDate({
      meetingDate: date.toISOString(),
      deadlineDate: endDate.toISOString(),
    }, type);
  };

  const handleCheckbox = (e: any) => {
    setPhasesDates(prev => ({ ...prev, isMeetingConducted: e.target.checked }));
    handleUploadDate(e.target.checked, "meetingConducted");
  };

  const getDateInputUi = () => {
    return (
      <div className='flex items-center mb-10 gap-8 flex-wrap'>
        <div className="flex items-center w-[335px]">
          <label className="text-left text-light-gray font-medium pr-4 text-nowrap w-32">Meeting Date :</label>
          <div className="flex flex-1 items-center border custom-radius px-2 h-11">
            <DatePickerIcon className="w-6 h-6 mr-2" />
            <DatePicker
              value={phasesDates.meetingDate}
              suffixIcon={null}
              variant={"borderless"}
              onChange={(e) => handlePhasesDateChange(e, "meetingDate")}
              format="MM/DD/YYYY"
              placeholder='MM/DD/YYYY'
              className="flex-1 w-full p-2"
              allowClear={false}
            />
          </div>
        </div>
        <div className="flex items-center w-[335px]">
          <label className="text-left text-light-gray font-medium pr-4 text-nowrap w-32">Deadline :</label>
          <div className="flex flex-1 items-center border h-11 custom-radius px-2">
            <DatePickerIcon className="w-6 h-6 mr-2" />
            <DatePicker
              value={phasesDates.deadlineDate}
              suffixIcon={null}
              variant={"borderless"}
              // onChange={(e) => handlePhasesDateChange(e, "deadlineDate")}
              format="MM/DD/YYYY"
              placeholder='MM/DD/YYYY'
              disabled={true}
              className="flex-1 w-full p-2"
            />
          </div>
        </div>
        <div>
          <Checkbox disabled={!phasesDates.meetingDate} className='text-base' onChange={handleCheckbox} checked={phasesDates.isMeetingConducted}>Meeting Conducted</Checkbox>
        </div>
      </div>
    )
  };


  return (
    <CollapsibleSection
      title='PHASE 1'
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
    </CollapsibleSection>
  );
}

export default PhaseOne;
