import AuthorizationForm from 'pages/services/components/authorization-form';
import * as authHelper from '../../../../auth/core/auth-helpers';
import FormIcon from 'assets/icons/form-icon.svg?react';
import BillingInvoice from 'pages/services/components/billing-invoice';
import { SERVICE_BILLING_DATA_TYPE, SERVICE_BILLING_SUBTYPE } from 'components/global/global';
import BillingNotes from 'pages/services/components/billing-notes';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import ServiceDetails from 'pages/services/components/service-details';
import TabSwitcher from 'components/core-ui/tab-switcher/TabSwitcher';
import { Divider } from 'antd';


interface BillingData {
  _id: string;
  client: string;
  case: string;
  type: number;
  subType: number;
  status: number;
  startDate?: string;
  endDate?: string;
  paymentDate?: string;
  description: string;
  invoiceNumber: string;
  documents: any[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
interface OrganizedBillingData {

  [typeKey: string]: {
    [subTypeKey: string]: BillingData[];
  };
}

function Billing({ billingCaseDataById, serviceData, refetchBillingData, refetch, section }: any) {
  const currentUser = authHelper.getUser();
  const [selectedTab, setSelectedTab] = useState(0);


  const data: any[] = billingCaseDataById?.data || [];
  const organizeData = (data: BillingData[]) => {
    const result: OrganizedBillingData = {};

    data.forEach((item) => {
      const typeKey = Object.keys(SERVICE_BILLING_DATA_TYPE).find(
        (key) => SERVICE_BILLING_DATA_TYPE[key as keyof typeof SERVICE_BILLING_DATA_TYPE] === item.type
      ) || "OTHER";

      const subTypeKey = Object.keys(SERVICE_BILLING_SUBTYPE).find(
        (key) => SERVICE_BILLING_SUBTYPE[key as keyof typeof SERVICE_BILLING_SUBTYPE] === item.subType
      ) || "OTHER";

      if (!result[typeKey]) {
        result[typeKey] = {};
      }
      if (!result[typeKey][subTypeKey]) {
        result[typeKey][subTypeKey] = [];
      }
      result[typeKey][subTypeKey].push(item);
    });

    return result;
  };

  const organizedData = organizeData(data);


  const [datesInvoice, setDatesInvoice] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const handleDateChangeInvoice = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDatesInvoice(dates);
  };

  // Filter notes based on date range (dateStrings)
  const filteredNotesInvoice = organizedData?.INVOICE?.NOTES?.filter((note: any) => {
    const createdAt = dayjs(note.createdAt);
    const [startDateString, endDateString] = datesInvoice
      ? [datesInvoice[0]?.format('MM-DD-YYYY'), datesInvoice[1]?.format('MM-DD-YYYY')]
      : [null, null];

    const startDate = startDateString ? dayjs(startDateString) : null;
    const endDate = endDateString ? dayjs(endDateString) : null;

    // Check if createdAt is within the selected date range
    return startDate && endDate
      ? createdAt.isAfter(startDate) && createdAt.isBefore(endDate)
      : true; // If no dates selected, return all notes
  }) || [];

  const tableHeaders = [
    { key: 'authorizationForm', label: 'Authorization Form' },
    { key: 'notes', label: 'Notes' },
    { key: 'billing(Invoice) ', label: 'Billing (Invoice ) ' },
  ];

  const randerTabsConteant = (selectedTab: number) => {
    switch (selectedTab) {
      case 0:
        return (
          <AuthorizationForm
            title={'Authorization Form'}
            description={'Click on Upload to add Authorization Form'}
            icon={<FormIcon />}
            serviceData={serviceData}
            billigDataType={SERVICE_BILLING_DATA_TYPE.AUTHORIZATION_FORM}
            billingDataSubType={SERVICE_BILLING_SUBTYPE.DOCUMENT}
            refetchCaseData={refetchBillingData}
            billingData={organizedData?.AUTHORIZATION_FORM?.DOCUMENT || []}
            currentUser={currentUser}
          />
        )
      case 1:
        return (
          <BillingNotes
            serviceData={serviceData}
            currentUser={currentUser}
            caseDataType={SERVICE_BILLING_DATA_TYPE.INVOICE}
            caseDataSubType={SERVICE_BILLING_SUBTYPE.NOTES}
            refetchCaseData={refetchBillingData}
            caseDocumentsNote={filteredNotesInvoice || []}
            handleDateChange={handleDateChangeInvoice}
            dates={datesInvoice}
            notesData={organizedData?.INVOICE?.NOTES || []}
          />
        )
      case 2:
        return (
          <BillingInvoice
            title={'Billing (invoice)'}
            description={'Click on Upload to add Billing (invoice)'}
            icon={<FormIcon />}
            serviceData={serviceData}
            currentUser={currentUser}
            caseDataType={SERVICE_BILLING_DATA_TYPE.INVOICE}
            caseDataSubType={SERVICE_BILLING_SUBTYPE.DOCUMENT}
            refetchCaseData={refetchBillingData}
            billingData={organizedData?.INVOICE?.DOCUMENT || []}
          />
        )
      default:
        break;
    }
  };


  return (
    <section className='my-10'>
      <ServiceDetails serviceData={serviceData} refetch={refetch} section={section} />
      <Divider />

      <TabSwitcher tabs={tableHeaders} selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <div className='mt-10'>
        {randerTabsConteant(selectedTab)}</div>
    </section>
  );
}

export default Billing;
