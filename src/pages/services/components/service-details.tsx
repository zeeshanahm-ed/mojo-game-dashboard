import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';

import { DatePicker, Popconfirm, Select } from 'antd';
import dayjs from 'dayjs';

import TextArea from 'antd/es/input/TextArea';

import Button from 'components/core-ui/button/button';
import { USER_ROLES } from 'components/global/global';

import { QUERIES_KEYS } from 'helpers/crud-helper/consts';
import { formatDate } from 'helpers/crud-helper/crud-helpers';
// import { CASES_STATUS_OF_JOB_PLACEMENT, CASES_STATUS_OF_SUPPORTED_EMPLOYMENT, status } from 'utils/global.status';
import { status } from 'utils/global.status';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';

import { UserDataParams } from 'pages/user-management/core/_modals';
import useUserData from 'pages/user-management/core/hooks/useUserData';

import DeleteIcon from 'assets/icons/delete-white-icon.svg?react';
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import RestartIcon from 'assets/icons/restart-icon.svg?react';

import * as authHelper from '../../../auth/core/auth-helpers';
import { ServiceDetailsProps } from '../core/_modals';
import useServiceDelete from '../core/hooks/useServiceDelete';
import useUpdateServiceAssign from '../core/hooks/useUpdateServiceAssign';
import useRestartService from '../core/hooks/useRestartService';
import { useNavigate } from 'react-router-dom';

const statusColors: { [key: string]: string } = {
  Completed: '#3C6D1E',
  Pending: '#F6921E',
  'In Progress': '#5BA8EE',
  Cancelled: '#851015',
};

const options = [
  { value: status.COMPLETED, label: 'Completed' },
  { value: status.PENDING, label: 'Pending' },
  { value: status.IN_PROGRESS, label: 'In Progress' },
  { value: status.CANCELLED, label: 'Cancelled' },
];
// const daysOptions = [
//   { value: CASES_STATUS_OF_JOB_PLACEMENT.FORTY_DAYS, label: '45 Days' },
//   { value: CASES_STATUS_OF_JOB_PLACEMENT.NINETY_DAYS, label: '90 Days' },
// ];
// const phaseOptions = [
//   { value: CASES_STATUS_OF_SUPPORTED_EMPLOYMENT.VAL_1, label: 'P1' },
//   { value: CASES_STATUS_OF_SUPPORTED_EMPLOYMENT.VAL2, label: 'P2' },
//   { value: CASES_STATUS_OF_SUPPORTED_EMPLOYMENT.VAL_3, label: 'P3' },
//   { value: CASES_STATUS_OF_SUPPORTED_EMPLOYMENT.VAL_4, label: 'P4' },
//   { value: CASES_STATUS_OF_SUPPORTED_EMPLOYMENT.VAL_5, label: 'P5' },
// ];

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceData, refetch, section }) => {
  const currentUser = authHelper.getUser();
  const queryClient = useQueryClient();
  const intitialParams: UserDataParams = {
    limit: 10,
    page: 1,
    search: '',
    role: '',
  };
  const navigate = useNavigate();
  const [listing, setListing] = useState({ ...intitialParams });
  const { userData } = useUserData(listing);
  const { deleteService } = useServiceDelete();
  const { mutate: updateServiceAssign } = useUpdateServiceAssign();
  const { restartServiceMutate } = useRestartService();
  const [description, setDescription] = useState(serviceData?.data?.description);
  const [serviceDuratiobPassedDays, setServiceDuratiobPassedDays] = useState<number | null>(null);
  // const [currentDay, setCurrentDay] = useState(dayjs().startOf('day'));

  // Count-up logic (days passed)
  useEffect(() => {
    if (serviceData?.data?.jobSearchDate && serviceData?.data?.lastDate) {
      const passed = dayjs(serviceData?.data?.lastDate).diff(serviceData?.data?.jobSearchDate, 'day');
      setServiceDuratiobPassedDays(passed);
    } else {
      setServiceDuratiobPassedDays(0);
    }
  }, [serviceData?.data]);

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


  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
    } catch (error) {
      showErrorMessage('Failed to delete client');
      console.error('Error deleting service:', error);
    }
  };

  const [timer, setSearchTimer] = useState<number | null>(null);
  const handleSearch = (value: string) => {
    clearTimeout(timer as number);
    const query = value;
    const newTimer = setTimeout(() => {
      setListing({ ...listing, page: 1, search: query });
    }, 2000);
    setSearchTimer(newTimer);
  };
  const handleSelect = (value: any) => {
    const body = {
      assignedTo: value,
    };
    try {
      // eslint-disable-next-line no-underscore-dangle
      updateServiceAssign(
        { id: serviceData?.data?._id, data: body },
        {
          onSuccess: () => {
            showSuccessMessage('Assigned Successfully');
            refetch();
          },
          onError: (error) => {
            showErrorMessage('Failed to assign!');
            console.error('Delete error', error);
          },
        }
      );
      // showSuccessMessage('Assigned Successfully');

      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      showErrorMessage('Failed to update service');
    }
  };
  function transformUsers(usersArray: any[]) {
    return usersArray?.map((user) => ({
      value: user._id,
      label: user.name,
    }));
  }
  const initialValue = (value: { _id: any; name: any }) => {
    return { value: value?._id, label: value?.name };
  };
  const initialStatus = (value: number) => {
    const matchedOption = options.find((option) => {
      return option.value === value;
    });
    return matchedOption || null;
  };
  // const initialSupportStatus = (value: number) => {
  //   const matchedOption = phaseOptions.find((option) => {
  //     return option.value === value;
  //   });
  //   return matchedOption || null;
  // };
  // const initialIndividualStatus = (value: number) => {
  //   const matchedOption = daysOptions.find((option) => {
  //     return option.value === value;
  //   });
  //   return matchedOption || null;
  // };
  const handleService = async (value: any) => {
    const body = {
      status: value,
    };
    try {
      // eslint-disable-next-line no-underscore-dangle
      await updateServiceAssign(
        { id: serviceData?.data?._id, data: body },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(QUERIES_KEYS.GET_SERVICE);
            showSuccessMessage('Status Updated Successfully');
          },
          onError: (error) => {
            showErrorMessage('Failed to update service');
            console.error('Delete error', error);
          },
        }
      );

      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      showErrorMessage('Failed to update service');
    }
  };

  // const handleServiceDays = async (value: any) => {
  //   const body = {
  //     statusOfJobPlacement: value,
  //   };
  //   try {
  //     // eslint-disable-next-line no-underscore-dangle
  //     await updateServiceAssign(
  //       { id: serviceData?.data?._id, data: body },
  //       {
  //         onSuccess: () => {
  //           queryClient.invalidateQueries(QUERIES_KEYS.GET_SERVICE);
  //           showSuccessMessage('Status Updated Successfully');
  //         },
  //         onError: (error) => {
  //           showErrorMessage('Failed to update service');
  //           console.error('Delete error', error);
  //         },
  //       }
  //     );

  //     // eslint-disable-next-line @typescript-eslint/no-shadow
  //   } catch (error) {
  //     showErrorMessage('Failed to update service');
  //   }
  // };

  // const handleServicePhase = async (value: any) => {
  //   const body = {
  //     statusOfSupportedEmployment: value,
  //   };
  //   try {
  //     // eslint-disable-next-line no-underscore-dangle
  //     await updateServiceAssign(
  //       { id: serviceData?.data?._id, data: body },
  //       {
  //         onSuccess: () => {
  //           queryClient.invalidateQueries(QUERIES_KEYS.GET_SERVICE);
  //           showSuccessMessage('Status Updated Successfully');
  //         },
  //         onError: (error) => {
  //           showErrorMessage('Failed to update service');
  //           console.error('Delete error', error);
  //         },
  //       }
  //     );

  //     // eslint-disable-next-line @typescript-eslint/no-shadow
  //   } catch (error) {
  //     showErrorMessage('Failed to update service');
  //   }
  // };

  const descriptionCalling = async (value: any) => {
    const body = {
      description: value,
    };
    try {
      // eslint-disable-next-line no-underscore-dangle
      await updateServiceAssign(
        { id: serviceData?.data?._id, data: body },
        {
          onSuccess: () => {
            // showSuccessMessage('Status Updated Successfully');
            queryClient.invalidateQueries(QUERIES_KEYS.GET_SERVICE);
          },
          onError: (error) => {
            // showErrorMessage('Failed to update service');
            console.error('Delete error', error);
          },
        }
      );
      // showSuccessMessage('Status Updated Successfully');

      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      showErrorMessage('Failed to save description');
    }
  };

  const [descrionTimer, setDescriptionTimer] = useState<number | null>(null);
  const handleDescription = (e: any) => {
    setDescription(e.target.value);
    clearTimeout(descrionTimer as number);
    const query = e.target.value;
    const newTimer = setTimeout(() => {
      descriptionCalling(query);
    }, 2000);
    setDescriptionTimer(newTimer);
  };
  const handleRestart = async () => {
    const date = new Date;
    const body = {
      status: 1,
      restartedDate: date.toISOString(),
      serviceId: serviceData?.data?.serviceId,
      caseType: serviceData?.data?.caseType?._id,
      caseId: serviceData?.data?._id,
      assignedTo: serviceData?.data?.assignedTo?._id,
    };
    try {
      await restartServiceMutate(body,
        {
          onSuccess: (data) => {
            const serviceId = data?.data?.data.restartedCaseId;
            navigate(`/services/service-detail/${serviceId}`);
            // showSuccessMessage('Service Restarted Successfully');
          },
          onError: (error) => {
            showErrorMessage('Failed to restart service');
            console.error('Delete error', error);
          },
        }
      );
    } catch (error) {
      showErrorMessage('Failed to restart service');
    }
  };

  return (
    <>
      {section === 'detailSection' ? (
        <section className="w-full my-10">
          {/* Top Section */}
          <div className="mb-8 flex flex-col-reverse gap-5 2xl:flex-row justify-between">
            <div className="w-full 2xl:w-[45%] flex items-center justify-between">
              <h3 className="text-light-gray font-medium">Client Name:</h3>
              <span >{serviceData?.data?.clientDetails?.name}</span>
            </div>
            <div className="w-full 2xl:w-[50%] flex flex-col md:flex-row  md:items-center justify-between text-light-gray font-medium gap-5 md:gap-0">
              <div className="flex items-center">
                Service Status:
                <Select
                  allowClear
                  className="h-11 rounded-lg w-36 text-center ml-4 md:ml-10"
                  placeholder="Select Status"
                  value={serviceData && initialStatus(serviceData?.data?.status)}
                  options={options.map((option) => ({
                    value: option.value,
                    label: (
                      <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[option.label] }}></div>
                        <p>{option.label}</p>
                      </div>
                    ),
                  }))}
                  onChange={handleService}
                />
              </div>
              {currentUser?.role === USER_ROLES.SUPER_ADMIN && (
                <div className="flex justify-end w-full md:w-auto">
                  <Popconfirm
                    title="Are you sure to delete this Service?"
                    placement="topRight"
                    onConfirm={() => handleDelete(serviceData?.data?._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      className="border-danger border bg-transparent text-danger text-sm gap-3 w-44 h-11 custom-radius  flex justify-center items-center px-0 hover:!text-red-600 hover:!border-red-600"
                    >
                      <DeleteIcon className='fill-danger' /> <p>Delete Service</p>
                    </Button>
                  </Popconfirm>
                </div>
              )}
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col 2xl:flex-row w-full justify-between flex-wrap gap-y-6 md:gap-y-0">
            <div className="w-full 2xl:w-[45%] flex flex-col gap-y-6 flex-wrap">
              <div className="flex items-center justify-between">
                <h3 className="text-light-gray font-medium">Client ID:</h3>
                <span >{serviceData?.data?.client?.basicInformation?.clientId}</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-light-gray font-medium">Service ID:</h3>
                <span >{serviceData?.data?.serviceId}</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-light-gray font-medium">Assigned To:</h3>
                <Select
                  showSearch
                  className="w-60 h-11 rounded-lg"
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  value={serviceData && initialValue(serviceData?.data?.assignedTo)}
                  onSearch={handleSearch}
                  onChange={handleSelect}
                  options={transformUsers(userData?.data)}
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-light-gray font-medium">Referral Date:</h3>
                <div className="flex items-center border border-gray-300 px-2 h-11 custom-radius  w-60">
                  <DatePickerIcon className="w-6 h-6 mr-2 text-gray-500" />
                  <DatePicker
                    value={serviceData?.data?.referralDate ? dayjs(serviceData?.data?.referralDate) : null}
                    className="w-full"
                    format={"MM/DD/YYYY"}
                    suffixIcon={null}
                    variant={"borderless"}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="w-full 2xl:w-[50%]">
              <TextArea
                placeholder="Description"
                className="custom-radius border  p-3 2xl:mt-0 mt-5"
                value={description}
                style={{ resize: 'none' }}
                rows={5}
                onChange={handleDescription}
              />
              <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
                <div className="flex items-center justify-between w-full sm:w-1/2 md:w-[45%] gap-x-10">
                  <h3 className="text-light-gray font-medium">Last Updated:</h3>
                  <span >
                    {serviceData?.data?.updatedAt ? formatDate(serviceData?.data?.updatedAt, "MM/DD/YYYY") : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full sm:w-1/2 md:w-[45%] gap-x-5">
                  <h3 className="text-light-gray font-medium">Last Updated By:</h3>
                  <span >{serviceData?.data?.lastUpdatedBy?.name || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-row w-full justify-between items-center mt-8 flex-wrap gap-y-6 md:gap-y-0">
            <div className="flex w-full sm:w-1/2 md:w-[45%] items-center justify-between">
              <h3 className="text-light-gray font-medium">Service Created by:</h3>
              <span >{serviceData?.data?.serviceCreatedBy?.name}</span>
            </div>
            {serviceData?.data?.caseType?.name === 'Individual Job Placement' && (
              <div className="md:w-[45%] 2xl:w-[50%] 2xl:mt-0">
                <div className="sm:w-full w-[42.5%] 2xl:w-[42%] flex items-center justify-between">
                  <h3 className="text-light-gray font-medium">Service Duration:</h3>
                  <span >{`${serviceDuratiobPassedDays} Days`}</span>
                </div>
              </div>
            )}
            {serviceData?.data?.caseType?.name === 'Supported Employment' && (
              <div className="md:w-[45%] 2xl:w-[50%] 2xl:mt-0">
                <div className=" sm:w-full 2xl:w-[42%] flex items-center justify-between gap-x-5">
                  <h3 className="text-light-gray font-medium w-[220px]">Total duration from phase 2 to phase 5 :</h3>
                  <span className="text-nowrap">{serviceData?.data?.totalDuration || "0"} Days</span>
                </div>
              </div>
            )}
          </div>

          {serviceData?.data?.caseType?.name === 'Individual Job Placement' ? (
            <div className="flex justify-end mt-8">
              <Popconfirm
                title="Are you sure to restart this Service?"
                placement="topRight"
                onConfirm={() => handleRestart()}
                okText="Yes"
                cancelText="No"
                disabled={[1, 3].includes(serviceData?.data?.status)}
              >
                <Button className={`bg-secondary mt-5 text-sm gap-3 w-44 flex justify-center items-center px-0 custom-radius h-11 ${[3].includes(serviceData?.data?.status) ? "hidden" : ""}`}>
                  <RestartIcon /> <p>Restart Service</p>
                </Button>
              </Popconfirm>
            </div>
          ) : (
            <></>
          )}
        </section>

      ) : (
        <div className="my-8 flex gap-5 justify-between items-start">
          <div className="font-medium w-full flex justify-between gap-y-6 items-center px-5 flex-wrap">
            <h3 className="text-light-gray">Client Name:</h3>
            <span className="text-black">{serviceData?.data?.clientDetails?.name}</span>
            <h3 className="text-light-gray">Client ID:</h3>
            <span className="text-black">{serviceData?.data?.client?.basicInformation?.clientId}</span>
            <h3 className="text-light-gray">Service ID:</h3>
            <span className="text-black">{serviceData?.data?.serviceId}</span>
            <h3 className="text-light-gray">Assigned to:</h3>
            <Select
              showSearch
              className="w-full max-w-xs h-11 custom-radius"
              placeholder="Search to Select"
              optionFilterProp="label"
              value={serviceData && initialValue(serviceData?.data?.assignedTo)}
              onSearch={handleSearch}
              onChange={handleSelect}
              options={transformUsers(userData?.data)}
              disabled
            />
          </div>
        </div>
      )}
    </>
  );

};

export default ServiceDetails;
