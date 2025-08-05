import { useState } from 'react';

import { Avatar, Popconfirm } from 'antd';

import Button from 'components/core-ui/button/button';
import { splitFileName } from 'components/global/global';
import UploadSupportDocumentModal from 'components/modals/upload-support-document';

import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';

import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import DownloadIcon from 'assets/icons/templates-download-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
import { FileTextOutlined, } from '@ant-design/icons';
import { VscListFlat } from "react-icons/vsc";


import useCreateCase from '../core/hooks/useCreateCase';
import useUploadData from '../core/hooks/useUploadData';
import useCaseDataDelete from '../core/hooks/useCaseDataDelete';
import moment from 'moment';
import useDeleteSingleDocument from '../core/hooks/useDeleteSingleDocument';

function OtherDocuments({
  serviceData,
  caseDataType,
  caseDataSubType,
  refetchCaseData,
  description,
  supportDocument,
  phase,
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { createCaseMutate } = useCreateCase();
  const { deleteCaseData, isDeletingCase } = useCaseDataDelete();
  const { getSignedUrl } = useUploadData();
  const [showMoreDescription, setShowMoreDescription] = useState<{ showMoreDesId: string | number; show: boolean; less: boolean }>({
    showMoreDesId: "",
    show: false,
    less: false
  });
  const { deleteSingleDocument, singleDeleteLoading } = useDeleteSingleDocument();
  const [editModalData, setEditModalData] = useState('');




  const showModal = () => {
    setIsModalOpen(true);
    setResetTrigger((prev) => !prev);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setUploadLoading(false);
    setEditModalData('')
  };
  const handleRemoveEntry = (id: string) => {
    deleteCaseData(id,
      {
        onSuccess: () => {
          refetchCaseData();
          showSuccessMessage('Deleted Successfully!')
        },
        onError: (error) => {
          console.error("Delete error", error);
          showErrorMessage('Error while deleting!')
        },
      })
  };

  const handleOk = async (fileList: any[], description: string) => {
    setUploadLoading(true);

    const s3Keys: string[] = [];

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

    const baseUrls = s3Keys.map((url) => {
      // Remove the query parameters by splitting on '?' and taking the first part
      const baseUrl = url.split('?')[0];
      return baseUrl; // Return the cleaned URL
    });
    if (baseUrls) {
      const clientServiceData = {
        client: serviceData?.data?.client?._id,
        case: serviceData?.data?._id,
        caseDataType: caseDataType,
        caseDataSubType: caseDataSubType,
        phase: phase,
      };
      const caseData = {
        ...clientServiceData,
        document: baseUrls,
        description: description,

      };
      createCaseMutate(caseData, {
        onSuccess: async () => {
          showSuccessMessage('Successfully uploaded!');
          setIsModalOpen(false);
          refetchCaseData();
          handleCancel()
        },
        onError: (error) => {
          showErrorMessage('Error while uploading!');
          console.error('Failed to get signed URL', error);
          handleCancel()
        },
      });
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

  const handleUpdate = async (fileList: any, caseItem: any) => {
    try {
      if (!caseItem) {
        throw new Error("Edit data is not available.");
      }
      // Extract existing document URLs from editData
      const existingDocs = fileList || [];

      // Separate fileList into existing and new files
      const newFiles = fileList.filter((file: any) => !file.url); // New files without a `url`
      const remainingDocs = fileList.filter((file: any) => file.url).map((file: any) => file.url);

      // Find removed documents
      const removedDocs = existingDocs.filter((doc: any) => !remainingDocs.includes(doc));

      // Remove deleted documents from the server
      for (const doc of removedDocs) {
        await handleRemoveDocument(caseItem._id, doc);
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
      };

      const updatedDocuments = [...remainingDocs, ...uploadedDocs];

      const updateBody = {
        ...caseItem,
        document: updatedDocuments,
      };
      deleteSingleDocument(
        { id: caseItem?._id, body: updateBody },
        {
          onSuccess: () => {
            refetchCaseData();
            handleCancel();
            showSuccessMessage('Updated Successfully!');
          },
          onError: (error: any) => {
            console.error('Delete error', error);
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
      <div className='flex justify-between items-center mb-2'>
        <Button variant='secondary' className='text-sm gap-3 h-11 custom-radius px-8' onClick={showModal}>
          <AddIcon /> Upload
        </Button>
      </div>
      {supportDocument?.length > 0 ? (
        supportDocument?.map((caseItem: any, item: number) => (
          <div key={item + 'suport'}>
            <div className='flex justify-between items-center gap-5 border-b border-border-gray py-3 w-full'>
              {caseItem?.document?.map((doc: any, index: number) => (
                <div className="flex items-center justify-between w-full" key={index}>
                  <div className="flex items-center gap-4 w-[15%]">
                    <Avatar size={40} src={caseItem?.user?.profilePicture} />
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-black">{caseItem?.user?.name}</span>
                      <span className="text-light-gray text-xs">{moment(caseItem?.createdAt).format('MM-DD-YYYY')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-[20%]">
                    <FileTextOutlined className="text-xl text-gray-500" />
                    <span className="text-sm truncate max-w-[90%]">{splitFileName(doc)}</span>
                  </div>


                  {caseItem?.description && <div className="flex items-center gap-2 w-[40%]">
                    <span><VscListFlat className="text-2xl text-gray-500" /></span>
                    <p className={`text-sm text-black ${showMoreDescription.showMoreDesId === index && showMoreDescription.show ? "max-w-[90%] whitespace-pre-line" : "truncate max-w-[80%]"}`}>
                      {showMoreDescription.showMoreDesId === index && showMoreDescription.show
                        ? caseItem?.description : caseItem?.description.length > 65 ? `${caseItem?.description.slice(0, 65)}...` : caseItem?.description}
                    </p>
                    {caseItem?.description.length > 65 && (
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
                    <Button variant='text' className='border-0 shadow-none px-0 w-6'
                      onClick={() => {
                        setIsModalOpen(true);
                        setEditModalData(caseItem)
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button variant='text' onClick={() => handleDirectDownload(caseItem?.document[0])} className='border-0 shadow-none px-0 w-6 h-5'>
                      <DownloadIcon className='w-full h-full' />
                    </Button>
                    <div className='flex gap-2'>
                      <Popconfirm
                        title='Are you sure to delete?'
                        placement='topRight'
                        onConfirm={() => handleRemoveEntry(caseItem?._id)}
                        okText='Yes'
                        cancelText='No'
                        disabled={isDeletingCase}
                      >
                        <Button variant='text' className='border-0 shadow-none px-0 w-6'>
                          <DeleteIcon />
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className='text-center text-light-gray font-medium py-5'>{description}</p>
      )}

      <UploadSupportDocumentModal
        resetTrigger={resetTrigger}
        onCancel={handleCancel}
        open={isModalOpen}
        handleUploadDocuments={handleOk}
        uploadLoading={uploadLoading}
        handleUpdate={handleUpdate}
        editModalData={editModalData}
        singleDeleteLoading={singleDeleteLoading}
      />

    </section>
  );
}

export default OtherDocuments;
