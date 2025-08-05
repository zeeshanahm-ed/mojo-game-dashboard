import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//icons
import { LoadingOutlined } from '@ant-design/icons';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
import AddIcon from 'assets/icons/rounded-add-icon.svg?react';
import SearchIcon from 'assets/icons/search-icon.svg?react';
// components
import { Empty, Input, Pagination, Popconfirm, Select, Spin } from 'antd';
import Button from 'components/core-ui/button/button';
//hoks & requests & helpers
import { formatDate } from 'helpers/crud-helper/crud-helpers';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { useHeaderProps } from 'components/core/use-header-props';
import { USER_ROLES } from 'components/global/global';
import * as authHelper from '../../auth/core/auth-helpers';
import { Client, ClientDataParams } from './core/_modals';
import { deleteClientData } from './core/_requests';
import useClientData from './core/hooks/clients';
import { formatUSPhoneNumber } from 'helpers/CustomHelpers';

const TABLE_HEAD = [
  { label: 'Client ID', key: 'clientId', sortable: true },
  { label: 'Name', key: 'clientName', sortable: true },
  { label: 'Created At', key: 'createdAt', sortable: true },
  { label: 'Contact Number', key: 'phoneNumber' },
  { label: 'Email Address', key: 'emailAddress' },
  { label: 'Client Status', key: 'status' },
  { label: 'Actions', key: 'actions' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'IN_ACTIVE', label: 'In Active' },
  { value: 'PENDING_AUTHORIZATION', label: 'Pending Authorization' },
  { value: 'PENDING_REFERRAL', label: 'Pending Referral' },
  { value: 'PENDING_AUTHORIZATION_AND_REFERRAL', label: 'Pending Authorization and Referral' },
];

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc' | null;
}

function Clients() {
  const currentUser = authHelper.getUser();
  const navigate = useNavigate();
  const { setTitle } = useHeaderProps();

  const [listing, setListing] = useState<ClientDataParams>({
    limit: 10,
    page: 1,
    search: '',
    status: undefined,
    sort: '',
    sortDirection: 'asc',
    filters: {},
  });

  const { clientData, isLoading, refetch } = useClientData(listing);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: '',
    direction: 'asc',
  });
  const [timer, setSearchTimer] = useState<number | null>(null);

  useEffect(() => {
    setTitle('Clients');
  }, [setTitle]);

  const toAddClient = () => navigate('/clients/add-client');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer as number);
    const query = e.target.value;
    const newTimer = window.setTimeout(() => {
      setListing({ ...listing, page: 1, search: query });
    }, 2000);
    setSearchTimer(newTimer);
  };

  const handlePageChange = (page: number) => {
    setListing({ ...listing, page });
  };

  const handleClientPageFilter = (value: string) => {
    setListing({ ...listing, page: 1, status: value });
  };

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/profile/${clientId}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClientData(id);
      showSuccessMessage('Client successfully deleted');
      refetch();
    } catch {
      showErrorMessage('Error deleting client');
    }
  };

  const getClientStatusLabel = (status: string) => {
    return STATUS_OPTIONS.find((item) => item.value === status)?.label || 'N/A';
  };

  const getValueByKey = (item: Client, key: string): any => {
    switch (key) {
      case 'clientId':
        return item.basicInformation?.clientId || '';
      case 'clientName':
        return item.basicInformation?.clientName || '';
      case 'createdAt':
        return item.createdAt || '';
      default:
        return '';
    }
  };

  const sortedData = useMemo(() => {
    const { key, direction } = sortConfig;
    if (!key || !direction) return clientData?.data || [];
    const data = [...(clientData?.data || [])];
    return data.sort((a, b) => {
      const aVal = getValueByKey(a, key);
      const bVal = getValueByKey(b, key);
      return aVal < bVal ? direction === 'asc' ? -1 : 1 : aVal > bVal ? direction === 'asc' ? 1 : -1 : 0;
    });
  }, [clientData?.data, sortConfig]);

  const handleSort = (value: any) => {
    if (!value.sortable) return;

    setSortConfig((prev) => {
      if (prev.key !== value.key) {
        return { key: value.key, direction: 'asc' };
      }

      if (prev.direction === 'asc') {
        return { key: value.key, direction: 'desc' };
      }

      if (prev.direction === 'desc') {
        return { key: '', direction: null };
      }

      return { key: value.key, direction: 'asc' };
    });
  };


  return (
    <section className='overflow-hidden mb-10'>
      <div className='flex items-center justify-between gap-3 mb-5 flex-wrap'>
        {currentUser?.role === USER_ROLES.SUPER_ADMIN && (
          <div>
            <Button onClick={toAddClient} variant='primary' className='h-11 px-8 gap-3 custom-radius w-50'>
              <AddIcon /> Add Client
            </Button>
          </div>
        )}

        <Input
          size='large'
          placeholder='Search Client by ID, Name'
          className='h-11 custom-radius flex-1 min-w-[300px]'
          onChange={handleSearchChange}
          prefix={
            <div className='pe-3'>
              <SearchIcon />
              {isLoading && <span className='absolute right-5 top-2'><Spin indicator={<LoadingOutlined spin />} /></span>}
            </div>
          }
        />

        <Select
          onChange={handleClientPageFilter}
          allowClear
          className='h-11 custom-radius text-left min-w-72'
          placeholder='Filter by status'
          options={STATUS_OPTIONS}
        />
      </div>

      <div className='w-full overflow-x-scroll'>
        <div className='min-w-[1100px] mb-5'>
          <div className='grid grid-cols-7 gap-1 border rounded-md border-secondary'>
            {TABLE_HEAD.map((head, index) => {
              const isSorted = sortConfig.key === head.key;
              return (
                <div
                  key={head.key}
                  className={`px-4 py-1 my-3 text-center text-light-gray font-medium text-sm ${head.sortable ? 'cursor-pointer' : ''} flex items-center justify-evenly gap-1 ${index !== TABLE_HEAD.length - 1 ? 'border-r border-r-secondary' : ''}`}
                  onClick={() => handleSort(head)}
                >
                  <span>{head.label}</span>
                  {head.sortable && (
                    <div className='flex items-center justify-center flex-col'>
                      <span className={`text-base ml-2 ${isSorted && sortConfig.direction === 'asc' ? 'text-secondary' : 'text-dark-gray'}`}><IoIosArrowUp /></span>
                      <span className={`text-base ml-2 ${isSorted && sortConfig.direction === 'desc' ? 'text-secondary' : 'text-dark-gray'}`}><IoIosArrowDown /></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isLoading ? (
            <div className='flex justify-center items-center h-32'>
              <Spin size="large" />
            </div>
          ) :
            <>
              {sortedData?.length > 0 ? (
                sortedData.map((client: Client) => (
                  <div key={client._id} className='py-2 grid grid-cols-7 gap-1 border-b border-border-gray text-center items-center font-normal text-[14px] cursor-pointer hover:bg-gray-50'>
                    <div className='px-4 py-4 cursor-pointer' onClick={() => handleClientClick(client._id)}>{client.basicInformation?.clientId?.slice(0, 8) || 'N/A'}</div>
                    <div className='px-4 py-4 cursor-pointer break-words' onClick={() => handleClientClick(client._id)}>{client.basicInformation?.clientName || 'N/A'}</div>
                    <div className='px-4 py-4' onClick={() => handleClientClick(client._id)}>{client.createdAt ? formatDate(client.createdAt.toString()) : 'N/A'}</div>
                    <div className='px-4 py-4 break-words' onClick={() => handleClientClick(client._id)}>{formatUSPhoneNumber(client.basicInformation?.phoneNumber) || 'N/A'}</div>
                    <div className='py-4 break-words text-[#5BA8EE]' onClick={() => handleClientClick(client._id)}>{client.basicInformation?.emailAddress || 'N/A'}</div>
                    <div className='py-4 break-words' onClick={() => handleClientClick(client._id)}>{getClientStatusLabel(client.status)}</div>
                    <div className='px-4 py-4 flex justify-center gap-x-5'>
                      <Button variant='text' onClick={() => handleClientClick(client._id)}><EditIcon className='text-black' /></Button>
                      {currentUser?.role === USER_ROLES.SUPER_ADMIN && (
                        <Popconfirm
                          title='Are you sure you want to delete this client?'
                          onConfirm={() => handleDelete(client._id)}
                          okText='Yes'
                          cancelText='No'
                        >
                          <Button variant='text'><DeleteIcon /></Button>
                        </Popconfirm>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <Empty className="my-12" description="No Data Found" />
              )}
            </>
          }
        </div>
      </div>
      <Pagination
        style={{ color: 'white' }}
        className='flex justify-center text-white mt-5'
        current={clientData?.currentPage}
        total={clientData?.totalItems}
        pageSize={clientData?.pageSize}
        onChange={handlePageChange}
      />

    </section>
  );
}

export default Clients;