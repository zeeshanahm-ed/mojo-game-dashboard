import { Divider, Spin } from 'antd';
import DetailsAuthorizationForm from 'pages/services/components/details-authorization-form';
import ServiceDetails from 'pages/services/components/service-details';
//Hooks & Utilits
import { CASES_DATA_SUBTYPE, CASES_DATA_TYPE } from 'components/global/global';
import { statusTextMap } from 'utils/global.status';
import dayjs from "dayjs"
import useGetIJPSRestartData from 'pages/services/core/hooks/useGetIJPSRestartData';
import { useNavigate } from 'react-router-dom';

interface TableHeader {
  key: string;
  title: string;
  className?: string;
}

const Details: React.FC<any> = ({ serviceData, caseDocumentData, refetch, refetchCaseData, section }) => {
  const serviceId = serviceData?.data?._id;
  const { IJP_Date, isLoading } = useGetIJPSRestartData(serviceId);
  const navigate = useNavigate();

  if (!serviceData) {
    return <div className='flex justify-center items-center h-32'>
      <Spin size="large" />
    </div>
  }



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

  const tableHeaders: TableHeader[] = [
    { key: 'createdAt', title: 'Created at', className: 'w-[20%]' },
    { key: 'restartedDate', title: 'Restarted Date', className: 'w-[20%]' },
    { key: 'serviceId', title: 'Service ID', className: 'w-[20%]' },
    { key: 'assignedTo', title: 'Assigned to', className: 'w-[20%]' },
    { key: 'status', title: 'Status', className: 'w-[20%]' },
  ];

  const handleNavigate = (data: any) => {
    navigate(`/services/service-detail/${data?.caseId}`);
  };

  return (
    <>
      <ServiceDetails serviceData={serviceData} refetch={refetch} section={section} />

      {serviceData?.data?.caseType?.name === 'Individual Job Placement' ? <></> : <Divider />}

      {/* Individual Job Placement Service Restart Data */}
      {serviceData?.data?.caseType?.name === 'Individual Job Placement' ?
        <div className="overflow-x-auto w-full mb-10">
          {isLoading ?
            <div className='flex justify-center items-center h-32'>
              <Spin size="large" />
            </div>
            :
            <>
              {IJP_Date?.data?.length > 0 ?
                <div className="min-w-[1200px]">
                  {/* Table Header */}
                  <div className="flex border border-light-blue rounded py-3 ">
                    {tableHeaders.map((header) => (
                      <div
                        key={header.key}
                        className={`border-r last:border-r-0 border-light-blue px-0 xl:px-6 py-1 text-light-gray text-center font-medium ${header.className}`}
                      >
                        {header.title}
                      </div>
                    ))}
                  </div>
                  {/* Table Body */}
                  <div className='max-h-[400px] overflow-y-auto'>
                    {IJP_Date?.data?.map((data: any, index: number) => (
                      <div key={index} onClick={() => handleNavigate(data)} className="cursor-pointer flex text-start xl:text-center items-center hover:bg-gray-50 border-b border-border-gray">
                        <div className="p-6 gap-2 whitespace-nowrap text-sm w-[20%]"> {data?.createdAt ? dayjs(data?.createdAt).format('MM/DD/YYYY') : "-"}</div>
                        <div className="p-6 px-0 xl:px-6 text-sm w-[20%]">{data?.restartedDate ? dayjs(data?.restartedDate).format('MM/DD/YYYY') : "-"}</div>
                        <div className="p-6 px-0 xl:px-6 text-sm w-[20%]">{data?.serviceId || "-"}</div>
                        <div className="p-6 px-0 xl:px-6 whitespace-nowrap text-sm w-[20%]">{data?.assignedTo?.name || "-"}</div>
                        <div className="p-6 px-0 xl:px-6 text-sm w-[20%]">{statusTextMap[data?.status] || 'Unknown'}</div>
                      </div>
                    ))
                    }
                  </div>
                </div>
                :
                // <Empty className="my-12" description="No Alerts Found" />
                <></>
              }
            </>
          }
        </div >
        :
        <DetailsAuthorizationForm
          serviceData={serviceData}
          authourizationData={mappedData}
          refetchCaseData={refetchCaseData} />
      }
    </>
  );
};

export default Details;
