import { useEffect, useState } from 'react';

import { Form, Spin } from 'antd';

import Button from 'components/core-ui/button/button';
import { useHeaderProps } from 'components/core/use-header-props';

import useBack from 'hooks/use-back';

import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';

import useUpdateClientData from 'pages/clients/core/hooks/useUpdateClientData';
import useUploadData from 'pages/services/core/hooks/useUploadData';

import EditIcon from 'assets/icons/edit-white-icon.svg?react';
import CollapseIcon from 'assets/icons/collapse-icon-expanded.svg?react';


import BasicInfo from './basic-info';
import OtherInfo from './other-info';

function ClientInformation({ clientData, clientInfoRefecth }: { clientData: any; clientInfoRefecth: any }) {
  const basicInfoValues = clientData?.basicInformation || {};
  const clientInfoValues = clientData?.clientInformation || {};
  const additionalInfoValues = clientData?.additionalInformation || {};
  const documentInfoValues = clientData?.documentInformation || {};
  const status = clientData.status || 'hello world'
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [updatingLoading, setUpdatingLoading] = useState(false);
  const { getSignedUrl } = useUploadData();
  const [resumeFile, setResumeFile] = useState<any>(undefined);

  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    basicInformation: basicInfoValues,
    clientInformation: clientInfoValues,
    additionalInformation: additionalInfoValues,
    documentInformation: documentInfoValues,
    status: status
  });

  if (!clientData) {
    return <Spin />;
  }

  const { setTitle, setBack, setUpdatedBy, setUpdatedDate, setAssignedBy } = useHeaderProps();
  const { handleBack } = useBack();
  const { mutate: updateClient } = useUpdateClientData();

  useEffect(() => {
    setTitle('Client Profile');
    setUpdatedBy('Kevin Hert');
    setAssignedBy('John Jones');
    setUpdatedDate(new Date());
    setBack(() => handleBack);
    return () => {
      setBack(undefined);
      setUpdatedBy(undefined);
      setAssignedBy(undefined);
    };
  }, [setTitle, setBack, setUpdatedBy, setAssignedBy]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  useEffect(() => {
    if (clientData) {
      setFormValues({
        basicInformation: clientData.basicInformation || {},
        clientInformation: clientData.clientInformation || {},
        additionalInformation: clientData.additionalInformation || {},
        documentInformation: clientData.documentInformation || {},
        status: clientData.status || ''
      });
    }
  }, [clientData]);
  const handleFormChange = (section: string, updatedValues: any) => {
    // Ensure updatedValues is always an object
    const safeUpdatedValues = updatedValues || {};

    setFormValues((prevValues) => ({
      ...prevValues,
      [section]: {
        ...safeUpdatedValues,
      },
      status: safeUpdatedValues.clientStatus || prevValues.status, // Use fallback for clientStatus
    }));
  };


  const uploadFiles = async (files: any[], s3Keys: string[]) => {
    for (const file of files) {
      const body = {
        name: file.name,
        type: file.type,
      };

      try {
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
                    body: files.find((f) => f.uid === file.uid).originFileObj,
                  });

                  s3Keys.push(signedUrl);
                  resolve();
                } catch (uploadError) {
                  console.error(`Upload failed for file ${file.name}`, uploadError);
                  reject(uploadError);
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
      } catch (error) {
        console.error(`Error handling file ${file.name}`, error);
      }
    }
  };
  const uploadSingleFile = async (file: any, s3Key: string[]) => {
    const body = {
      name: file.name,
      type: file.type,
    };

    try {
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

                s3Key.push(signedUrl);
                resolve();
              } catch (uploadError) {
                console.error(`Upload failed for file ${file.name}`, uploadError);
                reject(uploadError);
              }
            } else {
              console.error('Signed URL not found');
              reject('Signed URL not found');
            }
          },
          onError: (error: any) => {
            console.error('Failed to get signed URL', error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error(`Error handling file ${file.name}`, error);
    }
  };
  const handleUpdate = async () => {
    setUpdatingLoading(true);
    try {
      const s3Keys: string[] = [];
      const resumeS3Keys: string[] = [];

      if (fileList && fileList?.length > 0) {
        await uploadFiles(fileList, s3Keys);
      }
      if (resumeFile) {
        await uploadSingleFile(resumeFile, resumeS3Keys);
      }
      const resumeBaseUrls = resumeS3Keys.map((url) => url.split('?')[0]);
      const baseUrls = s3Keys.map((url) => url.split('?')[0]);
      await form.validateFields();

      const cleanFormValues = {
        basicInformation: form.getFieldsValue(),
        clientInformation: formValues.clientInformation,
        additionalInformation: formValues.additionalInformation,
        documentInformation: formValues.documentInformation,
        status: form.getFieldValue('clientStatus')
      };

      // cleanFormValues.basicInformation
      if (fileList?.length > 0) {
        cleanFormValues.basicInformation['referralDocument'] = baseUrls[0]; // Use only the first file
      } else {
        cleanFormValues.basicInformation['referralDocument'] = basicInfoValues?.referralDocument;
      }
      if (resumeFile) {
        cleanFormValues.documentInformation.resume = resumeBaseUrls;
      }

      await updateClient({ id: clientData._id, data: cleanFormValues });
      clientInfoRefecth();
      setUpdatingLoading(false);
      setFileList([]);
      // setResumeFile({});
      setIsEditMode(false);
    } catch (error) {
      showErrorMessage('Failed to update client');
      setUpdatingLoading(false);
    }
  };

  const deleteDoc = async () => {
    setUpdatingLoading(true);
    try {
      await form.validateFields();
      const cleanFormValues = {
        basicInformation: form.getFieldsValue(),
        clientInformation: formValues.clientInformation,
        additionalInformation: formValues.additionalInformation,
        status: form.getFieldValue('clientStatus'),
      };
      await updateClient({ id: clientData._id, data: cleanFormValues });
      showSuccessMessage('Document deleted successfully');
      setFormValues((prev) => ({ ...prev, documentInformation: {} }));
      clientInfoRefecth();
      setUpdatingLoading(false);
    } catch (error) {
      showErrorMessage('Failed to delete document');
      setUpdatingLoading(false);
    }
  };


  return (
    <section className='my-10'>
      <div className='flex items-center gap-5 mb-2 w-full'>
        <div className='flex items-center gap-3'> BASIC INFORMATION <CollapseIcon className='text-black fill-black' /></div>
        <div className='flex-1 h-[1px] bg-black'></div>
        <Button
          className={`${isEditMode ? 'bg-primary' : 'bg-[#333333]'} px-8 gap-3 text-xs`}
          onClick={isEditMode ? handleUpdate : toggleEditMode}
        >
          <EditIcon />
          {isEditMode ? <> {updatingLoading ? <Spin className='custom-spin' /> : 'Update'}</> : 'Edit'}
        </Button>
      </div>
      <BasicInfo
        isEditMode={isEditMode}
        initialValues={formValues}
        setFileList={setFileList}
        updateDoc={deleteDoc}
        fileList={fileList}
        form={form}
        onChange={(values: any) => handleFormChange('basicInformation', values)}
      />
      <OtherInfo
        isEditMode={isEditMode}
        initialValues={{
          clientInformation: formValues.clientInformation,
          additionalInformation: formValues.additionalInformation,
          documentInformation: formValues.documentInformation,

        }}
        setResumeFile={setResumeFile}
        resumeFile={resumeFile}
        onChange={(values: any) => {
          handleFormChange('clientInformation', values.clientInformation);
          handleFormChange('additionalInformation', values.additionalInformation);
          handleFormChange('documentInformation', values.documentInformation);
        }}
      />
      {/* {error && <p className='text-red-500'>{error}</p>} */}
    </section>
  );
}

export default ClientInformation;
