import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FilterOutlined } from '@ant-design/icons';
import { Drawer, Dropdown, Empty, Input, Pagination, Popconfirm, Radio, Select, Spin } from 'antd';

import Button from 'components/core-ui/button/button';
import { useHeaderProps } from 'components/core/use-header-props';
import { USER_ROLES } from 'components/global/global';
import ServicesModal from 'components/modals/services-modal';
import SearchableSelect from 'components/styledComponents/SearchableSelect';

import { formatDate } from 'helpers/crud-helper/crud-helpers';
import { caseStatus } from 'utils/caseutils';
import { statusColors, statusTextMap } from 'utils/global.status';
import { showErrorMessage } from 'utils/messageUtils';

import useClientData from 'pages/clients/core/hooks/clients';

import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
import AddIcon from 'assets/icons/rounded-add-icon.svg?react';
import SearchIcon from 'assets/icons/search-icon.svg?react';
// import WarningNAlertIcon from 'assets/icons/warningandalert-icon.svg?react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';


import * as authHelper from '../../auth/core/auth-helpers';
import { Case, ClientInfo, FormattedClient, serviceDataParams } from './core/_modals';
import useServiceData from './core/hooks/service';
import useServiceMutation from './core/hooks/useServiceMutation';
import { SERVICES_OPTIONS } from 'constants/global';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc' | null;
}

const sortOptions = [
  { label: 'Date (Oldest to Newest)', value: 'createdAt' },
  { label: 'Date (Newest to Oldest)', value: '-createdAt' },
  { label: 'Name (A to Z)', value: 'clientDetails.name' },
  { label: 'Name (Z to A)', value: '-clientDetails.name' },
  { label: 'Service (A to Z)', value: 'caseType' },
  { label: 'Service (Z to A)', value: '-caseType' },
  { label: 'Service Status (A to Z)', value: 'status' },
  { label: 'Service Status (Z to A)', value: '-status' },
];



function Services({ clientId, singleClientService, isClientProfile }: any) {
  const currentUser = authHelper.getUser();
  const intitialParams: serviceDataParams = {
    limit: 10,
    page: 1,
    search: '',
    sort: 'createdAt',
    status: null,
    clientId: '',
  };
  const [listing, setListing] = useState({ ...intitialParams });
  const { serviceData, refetch, isLoading: serverLoading } = useServiceData(listing, clientId, singleClientService);
  const { setTitle } = useHeaderProps();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createService, deleteService } = useServiceMutation(refetch);
  const navigate = useNavigate();
  const [serviceName, setServiceName] = useState<any>(null);
  const [sortOption, setSortOption] = useState('createdAt');
  const [serviceStatus, setServiceStatus] = useState(undefined);
  const [filterListing, setFilterListing] = useState<any>({ ...intitialParams });
  const { clientData, isLoading } = useClientData(filterListing);
  const [timer, setSearchTimer] = useState<number | null>(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: '',
    direction: 'asc',
  });

  useEffect(() => {
    setTitle('Services');
  }, [setTitle]);

  const handleSortChange = (e: any) => {
    setSortOption(e.target.value);
    setListing({ ...listing, page: 1, sort: e.target.value });
  };

  const handleSearch = (value: string) => {
    clearTimeout(timer as number);
    const query = value;
    const newTimer = setTimeout(() => {
      setFilterListing({ ...listing, page: 1, search: query });
    }, 2000);
    setSearchTimer(newTimer);
  };

  const handleSelectChange = (value: any) => {
    setServiceStatus(value);
  };

  const sortMenu = (
    <div className='p-4 bg-white rounded-md shadow-md'>
      <Radio.Group onChange={handleSortChange} value={sortOption}>
        {sortOptions.map((option) => (
          <Radio key={option.value} value={option.value} className='flex pb-4'>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async (formData: any) => {
    const data = {
      clientDetails: {
        _id: formData?.clientInfo?.id,
        name: formData?.clientInfo?.clientName,
      },
      client: formData?.clientInfo?.id,
      caseType: formData?.serviceType,
    };

    try {
      await createService(data);
    } catch (error) {
      showErrorMessage('Failed to add client');
      console.error('Error adding client:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleInputChange = (value: any) => {
    if (drawerOpen) {
      setServiceName(value);
    } else {
      setServiceName(value);
      setListing(prev => ({ ...prev, page: 1, clientId: value?.id }));
    }
  };
  const handleServiceFilterChange = (value: string | null) => {
    setListing(prev => ({ ...prev, page: 1, search: value }));
  };

  const handlePageChange = (page: number) => {
    setListing(prev => ({ ...prev, page: page }));
  };

  const formatClientData = (data: ClientInfo[] | undefined): FormattedClient[] => {
    if (!data) return [];
    return data.map((d) => ({
      id: d?._id || '',
      clientName: d?.basicInformation?.clientName || '',
      clientId: d?.basicInformation?.clientId || '',
      _id: d?._id,
      selectedClient: false,
      basicInformation: d?.basicInformation,
      text: d?.basicInformation?.clientName || '',
      value: d?._id || '',
    }));
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
    } catch (error) {
      showErrorMessage('Failed to delete client');
      console.error('Error deleting service:', error);
    }
  };

  const resetFilters = () => {
    setListing({ ...intitialParams });
    setServiceStatus(undefined);
    setDrawerOpen(false);
  };

  const formatServiceType = (data: any) => {
    if (!data) return [];
    return data.map((t: { basicInformation: any; id: any; title: any }) => ({
      value: t?.id,
      clientid: t?.basicInformation?.clientId,
      label: t?.title,
    }));
  };

  const handleFilter = () => {
    setListing({ ...listing, page: 1, status: serviceStatus, clientId: serviceName?.id });
    setDrawerOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer as number);
    const query = e.target.value;
    const newTimer = window.setTimeout(() => {
      setListing({ ...listing, page: 1, search: query });
    }, 2000);
    setSearchTimer(newTimer);
  };

  const handleServicesClick = (Id: string) => {
    navigate(clientId ? `/services/service-detail/${Id}` : `service-detail/${Id}`)
  };

  const getValueByKey = (item: Case, key: string): any => {
    switch (key) {
      case 'serviceId':
        return item?.serviceId || '';
      case 'service':
        return item?.caseType?.name || '';
      case 'created':
        return item.createdAt || '';
      default:
        return '';
    }
  };

  const sortedData = useMemo(() => {
    const { key, direction } = sortConfig;
    if (!key || !direction) return serviceData?.data || [];
    const data = [...(serviceData?.data || [])];
    return data.sort((a, b) => {
      const aVal = getValueByKey(a, key);
      const bVal = getValueByKey(b, key);
      return aVal < bVal ? direction === 'asc' ? -1 : 1 : aVal > bVal ? direction === 'asc' ? 1 : -1 : 0;
    });
  }, [serviceData?.data, sortConfig]);

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

  const TABLE_HEAD = [
    { label: 'Service ID', key: 'serviceId', sortable: true, },
    { label: 'Created', key: 'created', sortable: true, },
    { label: 'Service', key: 'service', sortable: true, },
    { label: 'Client ID', key: 'clientId', sortable: false, },
    { label: 'Client Name', key: 'clientName', sortable: false, },
    { label: 'Assigned to', key: 'assignedTo', sortable: false, },
    { label: 'Service Status', key: 'serviceStatus', sortable: false, },
  ];

  return (
    <section className='my-10'>
      <div className="flex flex-wrap items-center mb-5 w-full gap-5">
        {/* Create Service Button - 20% */}
        {currentUser?.role === USER_ROLES.SUPER_ADMIN && (
          <div className="flex-[2] min-w-[200px]">
            <Button
              onClick={showModal}
              variant="primary"
              className="w-full custom-radius h-11 px-6 gap-2 text-sm justify-center"
            >
              <AddIcon />
              Create a Service
            </Button>

            <ServicesModal
              open={isModalOpen}
              data={clientData?.data}
              onCancel={handleCancel}
              title="Delete"
              name="Andy Elliot"
              handleOkButton={handleOk}
            />
          </div>
        )}

        {/* Search Input - 40% if client profile */}
        {isClientProfile && (
          <div className="flex-[4] min-w-[300px]">
            <Input
              size="large"
              placeholder="Search by Service ID"
              className="h-11 custom-radius w-full"
              onChange={handleSearchChange}
              prefix={
                <div className="pe-3">
                  <SearchIcon />
                </div>
              }
            />
          </div>
        )}

        {/* Searchable Select - 20% */}
        {isClientProfile && (
          <div className="flex-[2] min-w-[200px] ">
            <SearchableSelect
              data={formatClientData(clientData?.data)}
              placeholder="Filter by Client Name"
              onSearch={handleSearch}
              handleInputChange={handleInputChange}
              allowClear={true}
            />
          </div>
        )}

        {/* Service Filter Select - 40% */}
        <div className={`${isClientProfile ? 'flex-[2]' : "flex-[4]"} min-w-[200px] flex items-center h-11 border custom-radius border-gray-300 px-3 bg-white`}>
          <Select
            onChange={handleServiceFilterChange}
            allowClear
            className="w-full"
            placeholder="Filter by Service"
            options={SERVICES_OPTIONS}
            variant="borderless"
          />
        </div>

        {/* Sorting Dropdown - 20% */}
        {!isClientProfile && (
          <div className=" min-w-[200px] ">
            <Dropdown overlay={sortMenu} trigger={['click']} placement="bottom">
              <Button variant="secondary" className="w-full h-11 custom-radius justify-center">
                Sorting
              </Button>
            </Dropdown>
          </div>
        )}

        {/* Filter Button - 20% */}
        {!isClientProfile && (
          <div className="min-w-[200px] ">
            <Button variant="primary" onClick={() => setDrawerOpen(true)} className="w-full custom-radius gap-2 h-11 justify-center">
              <FilterOutlined /> Filter
            </Button>
          </div>
        )}
      </div>

      {/*Custom Table */}
      <div className=" w-full overflow-x-auto">
        <div className="min-w-[1100px] mb-5">
          {/* Table Header */}
          <div className={`grid ${currentUser?.role === USER_ROLES.SUPER_ADMIN ? 'grid-cols-8' : 'grid-cols-7'} border border-secondary rounded-md text-sm font-medium text-gray-500 py-0`}>
            {TABLE_HEAD.map((head, index) => {
              const isSorted = sortConfig.key === head.key;

              return (

                <div key={index} onClick={() => handleSort(head)}
                  title='Click to sort'
                  className={` px-4 py-1 my-3 text-center text-light-gray font-medium text-sm ${head.sortable ? 'cursor-pointer' : ''} flex items-center justify-evenly gap-1 ${index !== TABLE_HEAD.length ? 'border-r border-secondary' : ''}`}
                >                  {head.label}
                  {head.sortable && (
                    <div className='flex items-center justify-center flex-col'>
                      <span className={`text-base ml-2 ${isSorted && sortConfig.direction === 'asc' ? 'text-secondary' : 'text-dark-gray'}`}><IoIosArrowUp /></span>
                      <span className={`text-base ml-2 ${isSorted && sortConfig.direction === 'desc' ? 'text-secondary' : 'text-dark-gray'}`}><IoIosArrowDown /></span>
                    </div>
                  )}
                </div>
              )
            })}
            {currentUser?.role === USER_ROLES.SUPER_ADMIN && (
              <div className={`px-4 py-1 my-3 text-center text-light-gray font-medium text-sm  flex items-center justify-evenly gap-1`}
              >Action</div>
            )}
          </div>

          {isLoading || serverLoading ? (
            <div className='flex justify-center items-center h-32'>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {sortedData?.length > 0 ? (
                <>
                  {sortedData?.map((singleCase: Case, index: number) => (
                    <div
                      key={index}
                      className={`grid ${currentUser?.role === USER_ROLES.SUPER_ADMIN ? 'grid-cols-8' : 'grid-cols-7'} cursor-pointer hover:bg-gray-50 py-2 border-b border-text-gray text-sm items-center`}
                    >
                      <div className="py-4 text-center flex justify-center items-center gap-2" onClick={() => handleServicesClick(singleCase?._id)}>
                        {/* <div className='w-[30%]'>{singleCase?.isWarningMeetingNotConducted || singleCase?.isWarningOnJobSupport45Days || singleCase?.isWarningOnJobSupport45Days ? <WarningNAlertIcon className='fill-[#DA8686] text-[#DA8686' /> : <></>}</div> */}
                        <div className=''>{singleCase?.serviceId || '-'}</div>
                      </div>

                      <div className="py-3 text-center" onClick={() => handleServicesClick(singleCase?._id)}>{formatDate(singleCase?.createdAt) || '-'}</div>
                      <div className="py-3 text-center" onClick={() => handleServicesClick(singleCase?._id)}>{singleCase?.caseType?.name || '-'}</div>
                      <div className="py-3 text-center" onClick={() => handleServicesClick(singleCase?._id)}> {singleCase?.client?.basicInformation?.clientId}</div>
                      <div className="py-3 text-center" onClick={() => handleServicesClick(singleCase?._id)}>  {singleCase?.client?.basicInformation?.clientName}</div>
                      <div className="py-3 text-center" onClick={() => handleServicesClick(singleCase?._id)}>{singleCase?.assignedTo?.name || '-'}</div>

                      <div className="py-3 flex items-center justify-center gap-2" onClick={() => handleServicesClick(singleCase?._id)}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[singleCase?.status] || '#000' }}></span>
                        <span>{statusTextMap[singleCase?.status] || 'Unknown'}</span>
                      </div>

                      {currentUser?.role === USER_ROLES.SUPER_ADMIN && (
                        <div className="py-3 flex justify-center gap-5">
                          <Button variant='text' onClick={() => handleServicesClick(singleCase?._id)}><EditIcon className='text-black' /></Button>
                          <Popconfirm
                            title="Are you sure to delete this service?"
                            onConfirm={() => handleDelete(singleCase?._id || '')}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteIcon className="cursor-pointer text-error-500" />
                          </Popconfirm>
                        </div>
                      )}
                    </div>
                  ))}
                </>

              ) : (
                <Empty className="my-12" description="No Service Found" />
              )}
            </>
          )}
        </div>
      </div>
      <Pagination
        style={{ color: 'white' }}
        className='flex justify-center text-white mt-5'
        current={serviceData?.currentPage}
        total={serviceData?.totalItems}
        pageSize={serviceData?.pageSize}
        onChange={handlePageChange}
      />


      {/* darawrr of right side */}
      <Drawer
        closable
        destroyOnHidden
        title={
          <div className='flex justify-between'>
            <p>Select Filters</p>
            <span className='cursor-pointer' onClick={() => resetFilters()}>
              Reset
            </span>
          </div>
        }
        placement='right'
        open={drawerOpen}
        // loading={loading}
        onClose={() => setDrawerOpen(false)}
      >
        <SearchableSelect
          data={formatClientData(clientData?.data)}
          placeholder='Select Client'
          onSearch={handleSearch}
          handleInputChange={handleInputChange}
        />

        <Select
          allowClear
          className='h-11 mt-5 text-left'
          style={{ width: '100%' }}
          size='large'
          placeholder='Select service status'
          options={formatServiceType(caseStatus)}
          value={serviceStatus}
          onChange={handleSelectChange}
        />
        <Button
          variant='primary'
          className='w-full flex justify-center mt-10 h-11 custom-radius'
          style={{ marginBottom: 16 }}
          onClick={handleFilter}
        >
          Submit
        </Button>
      </Drawer>
    </section >
  );
}

export default Services;
