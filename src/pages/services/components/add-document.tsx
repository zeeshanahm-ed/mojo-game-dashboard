/* eslint-disable react/no-array-index-key */
import { useState } from 'react';

import moment from 'moment';
//components
import { splitFileName } from 'components/global/global';
import UploadDocumentModal from 'components/modals/upload-document-modal';
import { Avatar, Popconfirm, Button } from 'antd';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
//icons
import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
import DownloadIcon from 'assets/icons/templates-download-icon.svg?react';
import { VscListFlat } from "react-icons/vsc";
import {
  FileTextOutlined,
} from '@ant-design/icons';
//Hooks and Modals
import { CaseDocument } from '../core/_modals';
import useCaseDataDelete from '../core/hooks/useCaseDataDelete';
import useCreateCase from '../core/hooks/useCreateCase';
import useUploadData from '../core/hooks/useUploadData';
import useDeleteSingleDocument from '../core/hooks/useDeleteSingleDocument';
import { StatusType } from 'components/global/statusConfig';


interface DocumentEntriesProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  serviceData: any;
  phase: any;
  caseDataType: any;
  caseDataSubType: any;
  refetchCaseData: any;
  caseDocumentData: any;
}
function AddDocuments({
  phase,
  serviceData,
  caseDataType,
  caseDataSubType,
  refetchCaseData,
  caseDocumentData,
  title,
  description,
}: DocumentEntriesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState("");
  const [resetTrigger, setResetTrigger] = useState(false);
  const { getSignedUrl } = useUploadData();
  const { createCaseMutate } = useCreateCase();
  const { deleteCaseData, isDeletingCase } = useCaseDataDelete();
  const [uploadLoading, setUploadLoading] = useState(false);
  const { deleteSingleDocument } = useDeleteSingleDocument();


  const showModal = (data: any) => {
    setIsModalOpen(true);
    setEditModalData(data)
    setResetTrigger((prev) => !prev);
  };
  const [showMoreDescription, setShowMoreDescription] = useState<{ showMoreDesId: string | number; show: boolean; less: boolean }>({
    showMoreDesId: "",
    show: false,
    less: false
  });


  const handleOk = async (fileList: any[], desc: string) => {
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
                setUploadLoading(false);
                reject('Signed URL not found');
              }
            },
            onError: (error) => {
              console.error('Failed to get signed URL', error);
              setUploadLoading(false);
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
        caseDataType: caseDataType,
        caseDataSubType: caseDataSubType,
        phase: phase,
        status: phase === 1 && title === "Signed Reports" ? StatusType.COMPLETED : undefined,
      };
      const caseData = {
        ...clientServiceData,
        description: desc,
        document: baseUrls,
      };
      createCaseMutate(caseData, {
        onSuccess: async () => {
          refetchCaseData();
          setUploadLoading(false);
          showSuccessMessage('Documents uploaded successfully!');
        },
        onError: (error) => {
          console.error('Failed to get signed URL', error);
          showErrorMessage('Error while uploading documents!');
          setUploadLoading(false);
        },
      });
    }
    // Update the entries state with the new entry
    // setEntries([...entries, { ...newEntry }]);
    setIsModalOpen(false);
  };


  const handleUpadetDocuments = async (fileList: any[], editData: any) => {
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
        document: updatedDocuments,
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
            handleCancel();
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
          refetchCaseData();
        },
        onError: (error) => {
          console.error('Delete error', error);
          showErrorMessage('Error while deleting!');
        },
      }
    );
  };

  const handleRemoveEntry = (documentId: string) => {
    deleteCaseData(documentId, {
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
    setEditModalData('');
    setUploadLoading(false);

  };

  const handleDirectDownload = (fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank'; // Open in a new tab
    link.style.display = 'none'; // Hide the element

    document.body.appendChild(link);
    link.click(); // Programmatically click to open in a new tab
    document.body.removeChild(link); // Remove the element after the action is triggered
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
      <div className='flex justify-between items-center'>
        <Button variant='text' className='bg-secondary shadow-none text-white text-sm gap-3 h-11 custom-radius px-8 font-medium' onClick={() => showModal("")}>
          <AddIcon /> Upload
        </Button>
      </div>
      {caseDocumentData?.length > 0 ? (
        caseDocumentData.map((caseItem: CaseDocument, index: number) => (
          <div key={index + 'caseDocument'} className='flex gap-5 items-center'>
            <div className='border-b border-border-gray w-full'>
              {caseItem?.document?.map((doc, index) => (
                <div className="flex items-center justify-between py-4 px-2" key={index}>
                  <div className="flex items-center gap-4 w-[15%]">
                    <Avatar size={40} src={caseItem?.user?.profilePicture} />
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-black">{caseItem?.user?.name}</span>
                      <span className="text-light-gray text-xs">{moment(caseItem?.createdAt).format('MM-DD-YYYY')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-[20%]">
                    <FileTextOutlined className="text-xl text-gray-500 " />
                    <span className="text-sm truncate max-w-[90%]">{splitFileName(doc)}</span>
                  </div>

                  {caseItem?.description && <div className="flex items-center gap-2 w-[40%]">
                    <span> <VscListFlat className="text-2xl text-gray-500" /></span>
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

                  <div className="flex gap-2 w-[10%] justify-end items-center">
                    {title !== "EVF Form" ? <Button variant='text' className='border-0 shadow-none px-0 w-6 justify-center' onClick={() => showModal(caseItem)}>
                      <EditIcon />
                    </Button> : <></>}
                    <Button variant='text' onClick={() => handleDirectDownload(doc)} className='border-0 shadow-none px-0 w-5 h-5 justify-center'>
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
                        <Button variant='text' className='border-0 shadow-none px-0 w-6 justify-center'>
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
      )
      }

      <UploadDocumentModal
        resetTrigger={resetTrigger}
        onCancel={handleCancel}
        open={isModalOpen}
        handleUploadDocuments={handleOk}
        uploadLoading={uploadLoading}
        editModalData={editModalData}
        handleUpadetDocuments={handleUpadetDocuments}
      />
    </section >
  );
}

export default AddDocuments;
