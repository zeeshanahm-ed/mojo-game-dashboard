/* eslint-disable react/no-array-index-key */
import { useState } from 'react';

import { Avatar, Popconfirm } from 'antd';

import Button from 'components/core-ui/button/button';
import { splitFileName } from 'components/global/global';
import UploadBillingInfo from 'components/modals/upload-biling-info';

import { statusColorMap, statusInvoiceMap } from 'utils/global.status';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import DownloadIcon from 'assets/icons/templates-download-icon.svg?react';
import MoneyIcon from 'assets/icons/money-icon.svg?react';

import useCreateCase from '../core/hooks/useCreateCase';
import useDeleteSingleBillingDocument from '../core/hooks/useDeleteSingleDocument copy';
import useUploadData from '../core/hooks/useUploadData';
import useBillingCaseDelete from '../core/hooks/useBillingCaseDelete';
import axios from 'axios';
import EditUploadBillingModal from 'components/modals/edit-upload-billing-modal';
import moment from 'moment';
import { FileTextOutlined } from '@ant-design/icons';
import { VscListFlat } from 'react-icons/vsc';
import React from 'react';

interface DocumentEntriesProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  serviceData: any;
  caseDataType: any;
  caseDataSubType: any;
  refetchCaseData: any;
  billingData: any;
  currentUser: any;
}
type EditData = {
  _id: string; // Ensure this matches the actual structure of your data
  [key: string]: any; // Optional: For additional dynamic properties
};
function BillingInvoice({
  serviceData,
  caseDataType,
  caseDataSubType,
  refetchCaseData,
  billingData,
  currentUser,
  description,
}: DocumentEntriesProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditData | null>(null);
  const [resetTrigger, setResetTrigger] = useState(false);
  const { getSignedUrl } = useUploadData();
  const { createBillingMutate } = useCreateCase();
  const { deleteSingleDocument } = useDeleteSingleBillingDocument();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    setResetTrigger((prev) => !prev);
  };
  const [showMoreDescription, setShowMoreDescription] = useState<{ showMoreDesId: string | number; show: boolean; less: boolean }>({
    showMoreDesId: "",
    show: false,
    less: false
  });

  const { deleteBillingData } = useBillingCaseDelete();
  const handleOk = async (fileList: any[], desc: any) => {
    setUploadLoading(true);

    const s3Keys: string[] = [];
    // Upload the files sequentially
    for (const file of fileList) {
      const body = {
        name: file.name,
        type: file.type,
      };

      // Get signed URL for the current file
      try {
        // Use await to ensure the getSignedUrl call completes before moving to the next file
        await new Promise<void>((resolve, reject) => {
          getSignedUrl(body, {
            onSuccess: async (data) => {
              const signedUrl = data?.data?.signedUrl;
              if (signedUrl) {
                try {
                  // Await the fetch to ensure each file is uploaded sequentially
                  await fetch(signedUrl, {
                    method: 'PUT',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': file.type,
                    },
                    body: fileList.find((f) => f.uid === file.uid).originFileObj,
                  });

                  // Push the signed URL to the array after a successful upload
                  s3Keys.push(signedUrl);
                  resolve(); // Continue to the next file
                } catch (uploadError) {
                  console.error(`Upload failed for file ${file.name}`, uploadError);
                  reject(uploadError); // If the upload fails, stop further execution
                  setUploadLoading(false);
                }
              } else {
                console.error('Signed URL not found');
                reject('Signed URL not found');
                setUploadLoading(false);
              }
            },
            onError: (error) => {
              console.error('Failed to get signed URL', error);
              reject(error);
              setUploadLoading(false);
            },
          });
        });
      } catch (error) {
        console.error(`Error handling file ${file.name}`, error);
        setUploadLoading(false);
      }
    }

    // After all files are uploaded successfully, save the entry
    const baseUrls = s3Keys.map((url) => {
      // Remove the query parameters by splitting on '?' and taking the first part
      const baseUrl = url.split('?')[0];
      return baseUrl; // Return the cleaned URL
    });

    if (baseUrls) {
      const clientServiceData = {
        client: serviceData?.data?.client?._id,
        case: serviceData?.data?._id,
        caseType: serviceData?.data?.caseType?._id,
        addedBy: currentUser?._id,
        type: caseDataType,
        subType: caseDataSubType,
      };
      const caseData = {
        ...clientServiceData,
        description: desc?.description,
        invoiceNumber: desc?.invoiceNumber,
        startDate: desc?.dateRange[0],
        endDate: desc?.dateRange[1],
        amount: desc?.totalAmount,
        status: desc?.status,
        paymentDate: desc?.paymentDate,
        documents: baseUrls,
        hoursAuthorized: ['Job Coaching', 'Work Readiness Training'].includes(
          serviceData?.data?.caseType?.name || ''
        ) ? desc?.hoursAuthorized : '',
        actualHours: ['Job Coaching', 'Work Readiness Training'].includes(
          serviceData?.data?.caseType?.name || ''
        ) ? desc?.actualHours : '',
      };
      createBillingMutate(caseData, {
        onSuccess: async () => {
          refetchCaseData();
          setUploadLoading(false);
          showSuccessMessage('Data uploaded successfully!');

        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const { response } = error;
            const errorMessage = response?.data?.message || 'An error occurred while making invoice';
            showErrorMessage(errorMessage);
            // console.error('Error adding client:', response);
          } else {
            showErrorMessage('Error while adding invoice!');
            console.error('Failed to get signed URL', error);
          }
        },
      });
    }
    setIsModalOpen(false);
  };

  const handleUpdate = async (fileList: any[], desc: any) => {
    setUpdateLoading(true);

    try {
      if (!editData) {
        throw new Error("Edit data is not available.");
      }
      // Extract existing document URLs from editData
      const existingDocs = editData?.documents || [];

      // Separate fileList into existing and new files
      const newFiles = fileList.filter((file) => !file.url); // New files without a `url`
      const remainingDocs = fileList.filter((file) => file.url).map((file) => file.url);

      // Find removed documents
      const removedDocs = existingDocs.filter((doc: any) => !remainingDocs.includes(doc));

      // Remove deleted documents from the server
      for (const doc of removedDocs) {
        await handleRemoveDocument(editData._id, doc);
      }

      // Upload new documents to S3
      const uploadedDocs: any[] = [];
      for (const file of newFiles) {
        const body = {
          name: file.name,
          type: file.type,
        };

        await new Promise<void>((resolve, reject) => {
          getSignedUrl(body, {
            onSuccess: async (data) => {
              const signedUrl = data?.data?.signedUrl;
              if (signedUrl) {
                try {
                  await fetch(signedUrl, {
                    method: 'PUT',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': file.type,
                    },
                    body: file.originFileObj,
                  });
                  uploadedDocs.push(signedUrl.split('?')[0]); // Add uploaded document URL
                  resolve();
                } catch (error) {
                  console.error(`Upload failed for file ${file.name}`, error);
                  reject(error);
                }
              } else {
                console.error('Signed URL not found');
                reject('Signed URL not found');
              }
            },
            onError: (error) => {
              console.error('Failed to get signed URL', error);
              reject(error);
            },
          });
        });
      }

      const updatedDocuments = [...remainingDocs, ...uploadedDocs];

      const updateBody = {
        ...desc,
        documents: updatedDocuments,
      };

      // Update the record in the backend
      deleteSingleDocument(
        { id: editData._id || '', body: updateBody },
        {
          onSuccess: () => {
            refetchCaseData();
            setIsEditOpen(false);
            showSuccessMessage('Updated Successfully!');
            setUpdateLoading(false);
          },
          onError: (error) => {
            console.error('Update error', error);
            showErrorMessage('Error while updating!');
          },
        }
      );
    } catch (error) {
      console.error('Error during update:', error);
      showErrorMessage('Error while updating!');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRemoveDocument = (id: any, docLink: any) => {
    const body = {
      documentToDelete: docLink,
    };
    deleteSingleDocument(
      { id: id, body: body },
      {
        onSuccess: () => {
          refetchCaseData();
          showSuccessMessage('updated Successfully!');
        },
        onError: (error) => {
          console.error('Delete error', error);
          showErrorMessage('Error while deleting!');
        },
      }
    );
  };
  const handleRemoveInvoice = (id: any) => {
    // const body = {
    //   documentToDelete: docLink,
    // };
    deleteBillingData(id, {
      onSuccess: () => {
        refetchCaseData();
        showSuccessMessage('Deleted Successfully!');
      },
      onError: (error) => {
        console.error('Delete error', error);
        showErrorMessage('Error while deleting!');
      },
    });
  }

  function StatusBadge({ status }: { status: number }) {
    const statusText = statusInvoiceMap[status] || '-';
    const backgroundColor = statusColorMap[status] || '#000';


    return <div style={{ background: backgroundColor }} className='text-white py-1 px-4 rounded'>{statusText}</div>;
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDirectDownload = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', splitFileName(fileUrl)); // Suggest a filename
      link.style.display = 'none'; // Hide the element

      document.body.appendChild(link);
      link.click(); // Programmatically click to trigger download
      document.body.removeChild(link); // Remove the element after the download is triggered
      window.URL.revokeObjectURL(downloadUrl); // Clean up the URL
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };

  const handleViewLess = (index: number) => {
    setShowMoreDescription({
      showMoreDesId: index,
      show: false,
      less: true
    });
  };
  const handleViewMore = (index: number) => {
    setShowMoreDescription({
      showMoreDesId: index,
      show: true,
      less: false
    })
  };

  return (
    <section>
      <div className='flex justify-between items-center mb-5'>
        <Button variant='secondary' className='text-sm gap-3 h-11 custom-radius px-8' onClick={showModal}>
          <AddIcon /> Upload
        </Button>
      </div>
      {billingData?.length > 0 ? (
        billingData.map((billingItem: any, index: number) => (
          <div className='flex flex-wrap gap-5 items-center justify-between w-full border-b border-border-gray py-4' key={index}>
            <div className="flex items-center gap-4 w-[15%]">
              <Avatar size={40} src={billingItem?.user?.profilePicture} />
              <div className="flex flex-col text-sm">
                <span className="font-medium text-black">{billingItem?.user?.name}</span>
                <span className="text-light-gray text-xs">{moment(billingItem?.createdAt).format('MM/DD/YYYY')}</span>
              </div>
            </div>
            <div className='flex text-base items-center gap-2 w-[150px]'>
              <span>Invoice No: </span>
              {billingItem?.invoiceNumber}
            </div>

            {billingItem?.documents?.map((doc: any, docIndex: number) => (
              <React.Fragment key={docIndex}>
                <div className="flex items-center gap-2 w-[15%]" >
                  <FileTextOutlined className="text-xl text-gray-500" />
                  <span className="text-sm truncate max-w-[90%]">{splitFileName(doc)}</span>
                </div>

                <div className='flex gap-2 w-[110px]'><MoneyIcon className='mt-[1px]' />${billingItem?.amount}</div>

                {
                  billingItem?.description && <div className="flex items-center gap-2 flex-1 max-w-[400px]">
                    <span><VscListFlat className="text-2xl text-gray-500" /></span>
                    <p className={`text-sm text-black ${showMoreDescription.showMoreDesId === index && showMoreDescription.show ? "max-w-[90%] whitespace-pre-line" : "truncate max-w-[80%]"}`}>
                      {showMoreDescription.showMoreDesId === index && showMoreDescription.show
                        ? billingItem?.description : billingItem?.description.length > 65 ? `${billingItem?.description.slice(0, 65)}...` : billingItem?.description}
                    </p>
                    {billingItem?.description.length > 65 && (
                      <>
                        {showMoreDescription.showMoreDesId === index && showMoreDescription.show ? (
                          <span className="text-primary text-xs cursor-pointer ml-1"
                            onClick={() => handleViewLess(index)}> Show less </span>
                        ) : (
                          <span
                            className="text-primary text-xs cursor-pointer ml-1"
                            onClick={() => handleViewMore(index)} > View more </span>
                        )}
                      </>
                    )}
                  </div>}

                <StatusBadge status={billingItem?.status} />

                <div className="flex gap-2 justify-end w-[10%]">
                  <Button variant='text' className='border-0 shadow-none px-0 w-6' onClick={() => {
                    setIsEditOpen(true);
                    setEditData(billingItem);
                  }}>
                    <EditIcon />
                  </Button>
                  <Button variant='text' onClick={() => handleDirectDownload(doc)} className='border-0 shadow-none px-0 w-6'>
                    <DownloadIcon className='w-5 h-5' />
                  </Button>
                  <div className='flex gap-2'>
                    <Popconfirm
                      title='Are you sure to delete?'
                      placement='topRight'
                      onConfirm={() => handleRemoveInvoice(billingItem._id)}
                      okText='Yes'
                      cancelText='No'
                    >
                      <Button variant='text' className='border-0 shadow-none px-0 w-6'>
                        <DeleteIcon />
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ))
      ) : (
        <p className='text-center text-light-gray font-medium py-5'>{description}</p>
      )}

      <UploadBillingInfo
        resetTrigger={resetTrigger}
        onCancel={handleCancel}
        open={isModalOpen}
        handleUploadDocuments={handleOk}
        uploadLoading={uploadLoading}
        serviceData={serviceData}
      />

      <EditUploadBillingModal
        onCancel={() => {
          setIsEditOpen(false);
          setEditData(null);
        }}
        open={isEditOpen}
        handleUploadDocuments={handleUpdate}
        billingData={editData}
        updateLoading={updateLoading}
        serviceData={serviceData}
      />
    </section>
  );
}

export default BillingInvoice;

