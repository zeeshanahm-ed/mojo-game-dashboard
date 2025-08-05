import { useEffect, useState } from 'react';

import { Button, DatePicker, Select } from 'antd';

import { useHeaderProps } from 'components/core/use-header-props';
import RevenueCard from 'components/revenue-card';
import SearchableSelect from 'components/styledComponents/SearchableSelect';

import useClientData from 'pages/clients/core/hooks/clients';
import { ClientInfo, FormattedClient } from 'pages/services/core/_modals';
import useServiceType from 'pages/services/core/hooks/serviceType';
import useUserData from 'pages/user-management/core/hooks/useUserData';
//icons
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import FormIcon from 'assets/icons/input-form-icon.svg?react';

import Graph from './components/graph';
import useAnalyticsData from './core/hooks/useAnalyticsData';
import { formatUserData } from 'helpers/CustomHelpers';

const { RangePicker } = DatePicker;

type InvoiceType = 'paidInvoices' | 'cancelledInvoices' | 'unpaidInvoices' | 'sentInvoices';

interface InvoiceData {
  totalAmount: number;
  count: number;
}

interface AggregatedInvoices {
  [key: string]: {
    [month: string]: InvoiceData;
  };
}

function Analytics({ onReset }: { onReset: () => void }) {
  const { setTitle } = useHeaderProps();
  const initialParams = {
    client: null,
    caseType: null,
    startDate: null,
    endDate: null,
    user: null,
  };
  const clientParams = {
    limit: 100,
    page: 1,
    search: '',
    sortDirection: 'desc',
    status: undefined,
    sort: undefined,
    filters: undefined,
  };
  const userParams = {
    limit: undefined,
    page: undefined,
    search: '',
    role: 'operations',
  };
  const [userListing] = useState({ ...userParams });
  const { userData } = useUserData(userListing);
  const [listing, setListing] = useState({ ...initialParams });
  const [clientListing, setClientListing] = useState({ ...clientParams });
  const { clientData } = useClientData(clientListing);
  const { serviceTypeData } = useServiceType();
  const { AnalyticsData } = useAnalyticsData(listing);
  const [dateRanges, setDateRanges] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    setTitle('Analytics');
  }, [setTitle]);

  const [timer, setSearchTimer] = useState<number | null>(null);
  const handleSearch = (value: string) => {
    clearTimeout(timer as number);
    const query = value;
    const newTimer = setTimeout(() => {
      setClientListing({ ...clientListing, page: 1, search: query });
    }, 2000);
    setSearchTimer(newTimer);
  };

  const handleCaseTags = (values: any) => {
    setListing({ ...listing, caseType: values });
  };

  const formatServiceType = (data: any) => {
    if (!data) return [];
    return data.map((t: { _id: any; name: any }) => ({
      value: t?._id,
      label: t?.name,
    }));
  };

  const formatClientData = (data: ClientInfo[] | undefined): FormattedClient[] => {
    if (!data) return [];
    return data.map((d) => ({
      _id: d?._id,
      selectedClient: false,
      basicInformation: d?.basicInformation,
      clientId: d?._id,
      id: d?._id,
      clientName: d?.basicInformation?.clientName,
      text: d?.basicInformation?.clientName || '',
      value: d?._id || '',
    }));
  };

  const handleChangeRange = (date: any) => {
    if (!date || date.length === 0) {
      setDateRanges({ startDate: null, endDate: null });
      setListing({ ...listing, startDate: null, endDate: null });
    } else {
      setDateRanges({ startDate: date[0], endDate: date[1] });
      setListing({
        ...listing,
        startDate: date[0].toISOString(),
        endDate: date[1].toISOString(),
      });
    }
  };

  const handleInputChange = (value: any) => {
    setListing({ ...listing, client: value?.id });
  };

  const handleUserInputChange = (value: any) => {
    setListing({ ...listing, user: value?.id });
  };

  const aggregateInvoiceTotals = (analyticData: any, dateRanges: any): AggregatedInvoices => {
    const result: AggregatedInvoices = {
      paidInvoices: {},
      cancelledInvoices: {},
      unpaidInvoices: {},
      sentInvoices: {},
    };

    const monthlyData = analyticData?.monthlyData;

    if (!monthlyData || typeof monthlyData !== 'object') {
      return result;
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    const isDateRangeEmpty = !dateRanges.startDate && !dateRanges.endDate;

    (Object.keys(monthlyData) as InvoiceType[]).forEach((invoiceType) => {
      const invoiceData = monthlyData[invoiceType];

      if (!invoiceData || typeof invoiceData !== 'object') {
        return;
      }

      Object.keys(invoiceData).forEach((year) => {
        if (isDateRangeEmpty && year !== currentYear.toString()) {
          return;
        }

        const monthData = invoiceData[year];

        Object.keys(monthData).forEach((month) => {
          const monthInvoices = monthData[month];

          if (!result[invoiceType][month]) {
            result[invoiceType][month] = { totalAmount: 0, count: 0 };
          }

          if (!monthInvoices || typeof monthInvoices !== 'object') {
            return;
          }

          Object.keys(monthInvoices).forEach((week) => {
            const weekData = monthInvoices[week];

            if (!weekData || typeof weekData !== 'object') {
              return;
            }

            result[invoiceType][month].totalAmount += weekData.totalAmount || 0;
            result[invoiceType][month].count += weekData.count || 0;
          });
        });
      });
    });

    return result;
  };


  return (
    <section className='overflow-hidden mb-10'>
      <div className='flex justify-between'>
        <h2 className='font-medium text-lg mb-5'>Revenue Generated with respect to Individual Service and time and Team Member</h2>
        {
          <span>
            {' '}
            <Button
              color='primary'
              variant='filled'
              className='font-light h-8 custom-radius bg-[#c5d8a5] text-[#2f4f2f] hover:bg-[#b0c490] hover:text-[#243b24]'
              onClick={onReset}
            >
              Reset Filters
            </Button>
          </span>
        }
      </div>
      <div className="flex flex-wrap gap-4">
        {/* Search By Service */}
        <div className="flex-grow basis-full lg:basis-[35%]">
          <Select
            size="large"
            className="w-full h-auto tags-input-selector"
            mode="multiple"
            allowClear
            placeholder="Search By Service"
            options={formatServiceType(serviceTypeData?.data)}
            onChange={handleCaseTags}
          />
        </div>

        {/* Date Picker with Icon */}
        <div className="flex items-center border rounded px-2 h-11 flex-grow basis-full lg:basis-[25%] xl:basis-[20%]">
          <DatePickerIcon className="w-6 h-6 mr-2" />
          <RangePicker
            suffixIcon={null}
            bordered={false}
            className="w-full h-full"
            onChange={handleChangeRange}
            format="MM-DD-YYYY"
          />
        </div>

        {/* Client Select */}
        <div className="flex-grow basis-full xl:basis-[15%]">
          <SearchableSelect
            data={formatClientData(clientData?.data)}
            placeholder="Select Client"
            onSearch={handleSearch}
            handleInputChange={handleInputChange}
            allowClear
          />
        </div>

        {/* Team Member Select */}
        <div className="flex-grow basis-full xl:basis-[15%]">
          <SearchableSelect
            data={formatUserData(userData?.data)}
            placeholder="Select Team Member"
            onSearch={handleSearch}
            handleInputChange={handleUserInputChange}
            allowClear
          />
        </div>
      </div>


      <Graph graphData={AnalyticsData?.monthlyData} dateRanges={dateRanges} />
      <div className='font-medium text-lg flex gap-4 items-center my-5'>
        <FormIcon /> Revenue by invoice
      </div>
      <RevenueCard analyticData={aggregateInvoiceTotals(AnalyticsData, dateRanges)} />
    </section>
  );
}

export default Analytics;
