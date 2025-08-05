
import { CASES_DATA_SUBTYPE, CASES_DATA_TYPE } from 'components/global/global';
import dayjs, { Dayjs } from 'dayjs';
import AddDocuments from 'pages/services/components/add-document';
import AddNotes from 'pages/services/components/add-notes';

import FormIcon from 'assets/icons/form-icon.svg?react';
import { useState } from 'react';
import OtherDocuments from 'pages/services/components/other-documents';
import TabSwitcher from 'components/core-ui/tab-switcher/TabSwitcher';

function TimeSheetReport({ serviceData, caseAllDocumentData, refetchCaseData }: any) {
  const caseDocumentData = caseAllDocumentData?.data?.['phase-6'] || {};

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


  const [selectedTab, setSelectedTab] = useState(0);

  const [datesEvf, setDatesEvf] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const handleDateChangeEvf = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDatesEvf(dates);
  };

  // Filter notes based on date range (dateStrings)
  const filteredNotesTimesheet = mappedData?.TIME_SHEET?.NOTES?.filter((note: any) => {
    const createdAt = dayjs(note.createdAt);
    const [startDateString, endDateString] = datesEvf
      ? [datesEvf[0]?.format('MM-DD-YYYY'), datesEvf[1]?.format('MM-DD-YYYY')]
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
    { key: 'timesheet', label: 'Timesheet', condition: true },
    { key: 'notes', label: 'Notes', condition: true },
    { key: 'otherDocuments', label: 'Other Documents', condition: true },
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
            phase={6}
            refetchCaseData={refetchCaseData}
            caseDocumentData={mappedData?.MONTHLY_REPORTS?.DOCUMENT || []}
            caseDataType={CASES_DATA_TYPE.MONTHLY_REPORTS}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
          />
        )
      case 1:
        return (
          <AddDocuments
            refetchCaseData={refetchCaseData}
            phase={6}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.TIME_SHEET}
            caseDataSubType={CASES_DATA_SUBTYPE.DOCUMENT}
            icon={<FormIcon />}
            title='TimeSheet'
            description='Click on Upload to add Timesheet Form'
            caseDocumentData={mappedData?.TIME_SHEET?.DOCUMENT || []}
          />
        )
      case 2:
        return (
          <AddNotes
            phase={6}
            serviceData={serviceData}
            caseDataType={CASES_DATA_TYPE.TIME_SHEET}
            caseDataSubType={CASES_DATA_SUBTYPE.NOTES}
            refetchCaseData={refetchCaseData}
            handleDateChange={handleDateChangeEvf}
            caseDocumentsNote={filteredNotesTimesheet || []}
            dates={datesEvf}
            notesData={mappedData?.TIME_SHEET?.NOTES}
          />
        )
      case 3:
        return (
          <OtherDocuments
            phase={6}
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

  return (
    <section className='my-10'>
      <TabSwitcher tabs={tableHeaders} selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <div className='mt-8'>{randerTabsConteant(selectedTab)}</div>
    </section>
  );
}

export default TimeSheetReport;