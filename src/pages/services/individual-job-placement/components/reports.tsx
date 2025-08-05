import { useState } from 'react';
import { Divider } from 'antd';
import FormIcon from 'assets/icons/form-icon.svg?react';

import { CASES_DATA_SUBTYPE, CASES_DATA_TYPE } from 'components/global/global';
import dayjs, { Dayjs } from 'dayjs';
//components
import AddDocuments from 'pages/services/components/add-document';
import AddNotes from 'pages/services/components/add-notes';
import ServiceDetails from 'pages/services/components/service-details';
import TabSwitcher from 'components/core-ui/tab-switcher/TabSwitcher';
import IndividualJobPlacementDates from './Individual-job-placement-dates';
import Extensions from 'pages/services/components/Extensions';

function Reports({ serviceData, caseAllDocumentData, refetchCaseData, refetch, section }: any) {

  const caseDocumentData = caseAllDocumentData?.data?.['phase-2'] || {};
  const [selectedTab, setSelectedTab] = useState(0);

  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const mappedData = Object.keys(caseDocumentData).reduce((acc: any, key) => {
    // Convert the string key to a number
    const numericKey = parseInt(key, 10);

    // Find the matching key from the CASES_DATA_TYPE enum
    const matchingTypeKey = Object.keys(CASES_DATA_TYPE).find(
      (enumKey) => CASES_DATA_TYPE[enumKey as keyof typeof CASES_DATA_TYPE] === numericKey
    ) as keyof typeof CASES_DATA_TYPE | undefined;

    // If a matching type is found, assign it to the new object
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

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDates(dates);
  };

  const tableHeaders = [
    { key: 'monthlyReports', label: 'Monthly Reports' },
    { key: 'extensions', label: 'Extensions' },
    { key: 'notes', label: 'Notes' },
    { key: 'evfForms', label: 'EVF Forms' },
    // { key: 'otherDocuments', label: 'Other Documents' },
  ];

  const randerTabsConteant = (selectedTab: number) => {
    switch (selectedTab) {
      case 0:
        return (
          <AddDocuments
            icon={<FormIcon />}
            title='Monthly Reports'
            description='Click on Upload to add Monthly Reports'
            serviceData={serviceData}
            phase={2}
            refetchCaseData={refetchCaseData}
            caseDocumentData={mappedData?.MONTHLY_REPORTS?.DOCUMENT || []}
            caseDataType={CASES_DATA_TYPE.MONTHLY_REPORTS}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
          />
        )
      case 1:
        return (
          <>
            <Extensions
              icon={<FormIcon />}
              title='Extensions'
              description='Click on Extend Days to add Extensions'
              serviceData={serviceData}
              phase={2}
              refetchCaseData={refetchCaseData}
              refetchServiceData={refetch}
              caseDocumentData={mappedData?.EXTENSIONS?.DOCUMENT || []}
              caseDataType={CASES_DATA_TYPE.EXTENSIONS}
              caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            />
          </>
        )
      case 2:
        return (
          <AddNotes
            phase={2}
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
      case 3:
        return (
          <AddDocuments
            refetchCaseData={refetchCaseData}
            phase={2}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.EVF_FORMS}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            icon={<FormIcon />}
            title='EVF Form'
            description='Click on Upload to add EVF Form'
            caseDocumentData={mappedData?.EVF_FORMS?.DOCUMENT || []}
          />
        )
      default:
        break;
    }
  };

  return (
    <section className='my-8'>
      <ServiceDetails serviceData={serviceData} refetch={refetch} section={section} />
      <Divider />
      {serviceData?.data?.caseType?.name === 'Individual Job Placement' ? <IndividualJobPlacementDates serviceData={serviceData} refetch={refetchCaseData} /> : <></>}
      <TabSwitcher tabs={tableHeaders} selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <div className='mt-8'>{randerTabsConteant(selectedTab)}</div>
    </section>
  );
}

export default Reports;

