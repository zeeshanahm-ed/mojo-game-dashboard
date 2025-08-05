import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Empty, Input, Pagination, Spin } from 'antd';

import Button from 'components/core-ui/button/button';
import { useHeaderProps } from 'components/core/use-header-props';
import RevenueCardBilling from 'components/revenue-card-billing';

import { formatDate } from 'helpers/crud-helper/crud-helpers';
import { statusColorMap, statusInvoiceMap } from 'utils/global.status';

import FilterIcon from 'assets/icons/filters-icon.svg?react';
import FormIcon from 'assets/icons/input-form-icon.svg?react';
import SearchIcon from 'assets/icons/search-icon.svg?react';

import FiltersModal from './components/filters-modal';
import { BillingDataParams } from './core/_modals';
import useBillingData from './core/hooks/useBillingData';

const TABLE_HEAD = ['Invoice Date', 'Invoice Number', 'Service', 'Client', 'User', 'Amount', 'Invoice Status'];

function Billing() {
  const initialParams: BillingDataParams = {
    limit: 10,
    page: 1,
    status: null,
    startDate: null,
    endDate: null,
    invoiceNumber: undefined
  };
  const [listing, setListing] = useState({ ...initialParams });
  const { BillingData, billingPagination, invoices, isLoading } = useBillingData(listing);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setTitle } = useHeaderProps();
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setListing({ ...listing, page: page });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (data: any) => {
    let updatedParams = {
      ...listing,
      startDate: '',
      endDate: '',
      status: null,
    };

    if (Array.isArray(data?.date) && data.date.length === 2) {
      const [start, end] = data.date;
      const adjustedStart = new Date(start);
      adjustedStart.setDate(adjustedStart.getDate() + 1);

      const adjustedEnd = new Date(end);
      adjustedEnd.setDate(adjustedEnd.getDate() + 1);

      updatedParams.startDate = adjustedStart.toISOString();
      updatedParams.endDate = adjustedEnd.toISOString();

      // Modify the time after setting the dates
      const finalStart = new Date(updatedParams.startDate);
      finalStart.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00.000 UTC

      const finalEnd = new Date(updatedParams.endDate);
      finalEnd.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59.999 UTC

      updatedParams.startDate = finalStart.toISOString();
      updatedParams.endDate = finalEnd.toISOString();
    }


    if (Array.isArray(data?.status) && data.status.length > 0) {
      updatedParams.status = data.status.map((status: any) => status);
    } else {
      updatedParams.status = data?.status || null;
    }
    setListing(updatedParams);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [timer, setSearchTimer] = useState<number | null>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer as number);
    const query = e.target.value;
    const newTimer = setTimeout(() => {
      setListing({ ...listing, page: 1, invoiceNumber: query });
    }, 2000);
    setSearchTimer(newTimer);
  };

  function StatusBadge({ status }: { status: number }) {
    const backgroundColor = statusColorMap[status] || '#000';
    const statusText = statusInvoiceMap[status] || '-';

    return (
      <div className={`mx-auto text-xs w-24 py-1 font-normal rounded-[3px]`} style={{ backgroundColor }}>
        {statusText}
      </div>
    );
  }
  const redirectInvoice = (id: string) => {
    navigate(`/services/service-detail/${id}?tab=${2}`);
  };
  useEffect(() => {
    setTitle('Billing');
  }, [setTitle]);


  return (
    <section className='overflow-hidden mb-10'>
      <div className='flex items-center gap-2 font-medium text-lg mb-5'>
        <FormIcon />
        Total Revenue By invoice
      </div>
      <RevenueCardBilling invoices={invoices} />
      <div className='flex gap-8 mt-8'>
        <Input
          size='large'
          placeholder='Search Invoices by Number'
          className='h-11 custom-radius'
          onChange={handleSearchChange}
          prefix={
            <div className='pe-3'>
              <SearchIcon />
            </div>
          }
        />
        <Button
          onClick={showModal}
          variant='secondary'
          className='h-11 custom-radius w-[250px] flex flex-centered gap-3 font-normal text-nowrap text-white'
        >
          Filter & Sort
          <FilterIcon />
        </Button>
      </div>
      <FiltersModal
        open={isModalOpen}
        onCancel={handleCancel}
        title='Delete'
        name='Andy Elliot'
        handleOkButton={handleOk}
      />
      <div className='pt-10 w-full overflow-x-scroll'>
        <div className='min-w-[1100px] mb-5'>
          <div className='py-1 grid grid-cols-7 gap-3 border rounded-md border-secondary'>
            {TABLE_HEAD.map((head, index) => (
              <div
                key={index}
                className={`px-4 py-1 my-3 ${index !== TABLE_HEAD.length - 1 ? 'border-r border-r-gray-400' : ''} text-center text-light-gray font-medium text-sm`}
              >
                {head}
              </div>
            ))}
          </div>
          {isLoading ? (
            <div className='flex justify-center items-center h-32'>
              <Spin size="large" />
            </div>
          ) : BillingData?.length > 0 ? (
            <>
              {BillingData?.map(({ date, number, service, client, case: caseData, user, amount, status }: any, index: number) => (
                <div key={index} onClick={() => redirectInvoice(caseData?._id)} className='hover:bg-gray-50 py-2 grid grid-cols-7 gap-3 border-b border-border-gray text-center items-center font-medium text-sm cursor-pointer'>
                  <div className='px-4 py-4 break-words'>{date ? formatDate(date) : 'N/A'}</div>
                  <div className='px-4 py-4 break-words'>{number || 'N/A'}</div>
                  <div className='px-4 py-4 break-words'>{service || 'N/A'}</div>
                  <div className='px-4 py-4 break-words'>{client || 'N/A'}</div>
                  <div className='px-4 py- break-words'>{user || 'N/A'}</div>
                  <div className='px-4 py-4 break-words'>{amount ? '$' + amount : 'N/A'}</div>
                  <div className={`mx-auto text-xs text-white w-24 py-1 font-normal rounded-[3px] `}>
                    <StatusBadge status={status} />
                  </div>
                </div>
              ))}
            </>
          ) :
            <Empty className="my-12" description="No Data Found" />
          }
        </div>
      </div>
      <Pagination
        style={{ color: 'white' }}
        className='flex justify-center text-white mt-5'
        current={billingPagination?.currentPage}
        total={billingPagination?.totalItems}
        pageSize={billingPagination?.pageSize}
        onChange={handlePageChange}
      />
    </section>
  );
}

export default Billing;
