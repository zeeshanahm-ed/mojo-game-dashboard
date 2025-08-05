import { useState } from 'react';

import { Avatar, Popconfirm } from 'antd';
import moment from 'moment';

import Button from 'components/core-ui/button/button';
import { splitFileName } from 'components/global/global';
import UploadBillingAuthorization from 'components/modals/upload-biling-authorization';

import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';

import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
// import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import DownloadIcon from 'assets/icons/templates-download-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';

import useBillingCaseDelete from '../core/hooks/useBillingCaseDelete';
import useCreateCase from '../core/hooks/useCreateCase';
import useDeleteSingleBillingDocument from '../core/hooks/useDeleteSingleDocument copy';
import useUploadData from '../core/hooks/useUploadData';
import { VscListFlat } from 'react-icons/vsc';
import { FileTextOutlined } from '@ant-design/icons';

interface DocumentEntriesProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  serviceData: any;
  billigDataType: any;
  billingDataSubType: any;
  refetchCaseData: any;
  currentUser: any;
  billingData: any;
}
function AuthorizationForm({
  serviceData,
  billigDataType,
  billingDataSubType,
  refetchCaseData,
  billingData,
  currentUser,
  description,
}: DocumentEntriesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [entries, setEntries] = useState<Entry[]>([]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const { getSignedUrl } = useUploadData();
  const { createBillingMutate } = useCreateCase();
  const { deleteBillingData } = useBillingCaseDelete();
  const { deleteSingleDocument } = useDeleteSingleBillingDocument();
  const [showMoreDescription, setShowMoreDescription] = useState<{ showMoreDesId: string | number; show: boolean; less: boolean }>({
    showMoreDesId: "",
    show: false,
    less: false
  }); const [editModalData, setEditModalData] = useState('');
  // const [dates, setDates] = useState({
  //   startDate: "",
  //   endDate: "",
  // })

  const [uploadLoading, setUploadLoading] = useState(false);

  const showModal = (data: any) => {
    setIsModalOpen(true);
    setResetTrigger((prev) => !prev);
    setEditModalData(data)
  };

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
                  setUploadLoading(false);
                  reject(uploadError); // If the upload fails, stop further execution
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
        type: billigDataType,
        subType: billingDataSubType,

      };
      const caseData = {
        ...clientServiceData,
        startDate: desc?.dateRange[0],
        endDate: desc?.dateRange[1],
        description: desc?.description,
        invoiceNumber: desc?.invoiceNumber, // ✅ Include invoice number here
        documents: baseUrls,
      };
      createBillingMutate(caseData, {
        onSuccess: async () => {
          refetchCaseData();
          handleCancel()
          showSuccessMessage('Data uploaded successfully!');
        },
        onError: (error) => {
          console.error('Failed to get signed URL', error);
          showErrorMessage('Error while uploading data!');
          handleCancel()
        },
      });
    }
    setIsModalOpen(false);
  };

  const handleUpdate = async (fileList: any[], editData: any) => {
    setUploadLoading(true);

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
        ...editData,
        documents: updatedDocuments,
      };

      // Update the record in the backend
      deleteSingleDocument(
        { id: editData._id || '', body: updateBody },
        {
          onSuccess: () => {
            refetchCaseData();
            showSuccessMessage('Updated Successfully!');
            handleCancel()

          },
          onError: (error) => {
            console.error('Update error', error);
            showErrorMessage('Error while updating!');
            handleCancel()

          },
        }
      );
    } catch (error) {
      console.error('Error during update:', error);
      showErrorMessage('Error while updating!');
    } finally {
      handleCancel()
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
        },
        onError: (error) => {
          console.error('Delete error', error);
          showErrorMessage('Error while deleting!');
        },
      }
    );
  };

  const handleRemoveEntry = (documentId: string) => {
    deleteBillingData(documentId, {
      onSuccess: () => {
        refetchCaseData();
        showSuccessMessage('Deleted Successfully!');
      },
      onError: (error) => {
        console.error('Delete error', error);
        showErrorMessage('Error while deleting!');
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUploadLoading(false);
    setEditModalData('')
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
  // const handleDateChange = (date: any, type: string) => {
  //   setDates(prev => ({ ...prev, [type]: date }));
  // };

  // const getDateInputUi = () => {
  //   return (
  //     <div className='flex items-center mb-10'>
  //       <div className="flex items-center">
  //         <label className="w-1/3 text-left text-light-gray font-medium pr-4 text-nowrap">Start Date :</label>
  //         <div className="flex flex-1 items-center border h-11 custom-radius px-2">
  //           <DatePickerIcon className="w-6 h-6 mr-2" />
  //           <DatePicker
  //             value={dates.startDate}
  //             suffixIcon={null}
  //             variant={"borderless"}
  //             onChange={(e) => handleDateChange(e, "startDate")}
  //             format="MM/DD/YYYY"
  //             placeholder='MM/DD/YYYY'
  //             className="flex-1 w-full p-2"
  //           />
  //         </div>
  //       </div>
  //       <div className="flex items-center ml-8 ">
  //         <label className="w-1/3 text-left text-light-gray font-medium pr-4 text-nowrap">End Date :</label>
  //         <div className="flex flex-1 items-center border px-2 h-11 custom-radius">
  //           <DatePickerIcon className="w-6 h-6 mr-2" />
  //           <DatePicker
  //             value={dates.endDate}
  //             suffixIcon={null}
  //             variant={"borderless"}
  //             onChange={(e) => handleDateChange(e, "endDate")}
  //             format="MM/DD/YYYY"
  //             placeholder='MM/DD/YYYY'
  //             className="flex-1 w-full p-2"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <section>
      {/* {getDateInputUi()} */}
      {/* <Divider /> */}
      <div className='flex justify-between items-center'>
        <Button variant='secondary' className='text-sm gap-3 h-11 custom-radius px-8' onClick={() => showModal("")}>
          <AddIcon /> Upload
        </Button>
      </div>
      {billingData?.length > 0 ? (
        billingData.map((billingItem: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-4 px-2 border-b border-border-gray">
            {billingItem?.documents?.map((doc: any, docIndex: number) => (
              <div className='flex items-center justify-between w-full' key={docIndex}>
                <div className="flex items-center gap-4 w-[15%]">
                  <Avatar size={40} src={billingItem?.user?.profilePicture} />
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-black">{billingItem?.user?.name}</span>
                    <span className="text-light-gray text-xs">{moment(billingItem?.createdAt).format('MM/DD/YYYY')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-xl text-gray-500" />
                  <span className="text-sm truncate max-w-[90%]">{splitFileName(doc)}</span>
                </div>

                {
                  billingItem?.description && <div className="flex items-center gap-2 w-[40%]">
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

                <div className="flex gap-2 w-[20%] justify-end">
                  <Button variant='text' className='border-0 shadow-none px-0 w-6 h-6 justify-center' onClick={() => showModal(billingItem)}>
                    <EditIcon />
                  </Button>
                  <Button variant='text' onClick={() => handleDirectDownload(doc)} className='border-0 shadow-none px-0 w-5 h-5 justify-center'>
                    <DownloadIcon className='w-full h-full' />
                  </Button>
                  <div className='flex gap-2'>
                    <Popconfirm
                      title='Are you sure to delete?'
                      placement='topRight'
                      onConfirm={() => handleRemoveEntry(billingItem._id)}
                      okText='Yes'
                      cancelText='No'
                    >
                      <Button variant='text' className='border-0 shadow-none px-0 w-6 justify-center'>
                        <DeleteIcon />
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            ))}
            <div />
          </div>))
      ) : (
        <p className='text-center text-light-gray font-medium py-5'>{description}</p>
      )}

      <UploadBillingAuthorization
        resetTrigger={resetTrigger}
        onCancel={handleCancel}
        open={isModalOpen}
        handleUploadDocuments={handleOk}
        uploadLoading={uploadLoading}
        serviceData={serviceData}
        editModalData={editModalData}
        handleUpdate={handleUpdate}
      />
    </section>
  );
}

export default AuthorizationForm;
