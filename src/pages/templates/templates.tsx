import { useEffect, useState } from 'react';
//components
import { Input, Popconfirm, Select, Spin, Tag } from 'antd';
import Button from 'components/core-ui/button/button';
import { splitFileName } from 'components/global/global';
import UploadTemplates from 'components/modals/upload-template';

//icons

import { LoadingOutlined } from '@ant-design/icons';
import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import SearchIcon from 'assets/icons/search-icon.svg?react';
import DownloadIcon from 'assets/icons/templates-download-icon.svg?react';
// import TemplatesFormIcom from 'assets/icons/templates-icon.svg?react';

//hooks and utils
import { useHeaderProps } from 'components/core/use-header-props';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { TemplateDataParams } from './core/_modals';
import useUploadData from 'pages/services/core/hooks/useUploadData';
import useCreateTemplate from './core/hooks/useCreateTemplate';
import useTemplateData from './core/hooks/useTemplateData';
import useTemplateDelete from './core/hooks/useTemplateDelete';

const options = [
  { value: 'General Forms', label: 'General Forms' },
  { value: 'Supported Employment Forms', label: 'Supported Employment Forms' },
  { value: 'Billing Forms', label: 'Billing Forms' },
  { value: 'Job Coaching Forms', label: 'Job Coaching Forms' },
];

function Templates() {
  const intitialParams: TemplateDataParams = {
    search: '',
    tags: '',
  };
  const [listing, setListing] = useState({ ...intitialParams });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getSignedUrl } = useUploadData();
  const [uploadLoading, setUploadLoading] = useState(false);
  const { templateData, reftechTemplate, isLoading } = useTemplateData(listing);
  const { createTemplateMutate } = useCreateTemplate();
  const { setTitle } = useHeaderProps();
  const { deleteTemplate, isDeleteLoading } = useTemplateDelete();


  useEffect(() => {
    setTitle('Templates');
  }, [setTitle]);

  const handleTagChange = (value: string[]) => {
    // Update the `tags` field in the `listing` state
    setListing((prevListing) => ({
      ...prevListing,
      tags: value.join(','), // Join the array of tags into a comma-separated string
    }));
  };

  const [timer, setSearchTimer] = useState<number | null>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer as number);
    const query = e.target.value;
    const newTimer = setTimeout(() => {
      setListing({ ...listing, search: query });
    }, 2000);
    setSearchTimer(newTimer);
  };

  const handleRemove = (id: any) => {
    deleteTemplate(id, {
      onSuccess: () => {
        reftechTemplate();
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
  };

  const handleOk = async (fileList: any[], tag: any) => {
    setUploadLoading(true);

    const s3Keys: string[] = [];
    const body = {
      name: fileList[0].name,
      type: fileList[0].type,
    };

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
                    'Content-Type': fileList[0].type,
                  },
                  body: fileList.find((f) => f.uid === fileList[0].uid).originFileObj,
                });

                // Push the signed URL to the array after a successful upload
                s3Keys.push(signedUrl);
                resolve(); // Continue to the next file
              } catch (uploadError) {
                console.error(`Upload failed for file ${fileList[0].name}`, uploadError);
                reject(uploadError); // If the upload fails, stop further execution
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
      console.error(`Error handling file ${fileList[0].name}`, error);
    }

    const baseUrls = s3Keys.map((url) => {
      const baseUrl = url.split('?')[0];
      return baseUrl;
    });

    if (baseUrls) {
      const body = {
        name: tag?.name,
        fileUrl: baseUrls[0],
        tags: tag?.tags,
      };
      createTemplateMutate(body, {
        onSuccess: async () => {
          reftechTemplate();
          setUploadLoading(false);
          setIsModalOpen(false);
          showSuccessMessage('Template created successfully!');
        },
        onError: (error) => {
          console.error('Failed to get signed URL', error);
          showErrorMessage('Error while creating template!');
        },
      });
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

  // const handleOpenDownload = (fileUrl: string) => {
  //   const link = document.createElement('a');
  //   link.href = fileUrl;
  //   link.target = '_blank'; // Open in a new tab
  //   link.style.display = 'none'; // Hide the element

  //   document.body.appendChild(link);
  //   link.click(); // Programmatically click to open in a new tab
  //   document.body.removeChild(link); // Remove the element after the action is triggered
  // };

  const getTagsColor = (tag: string) => {
    switch (tag) {
      case 'General Forms':
        return '#7FB6C2';
      case 'Supported Employment Forms':
        return '#ABB162';
      case 'Billing Forms':
        return '#766BBC';
      case 'Job Coaching Forms':
        return '#BC836B';
      default:
        return '';
    }
  };

  const tagRender = (props: any) => {
    const { label, closable, onClose } = props;
    return (
      <Tag
        color="blue"
        closable={closable}
        onClose={onClose}
        style={{ backgroundColor: getTagsColor(label), }}
        className={`text-white text-base p-2 border-0`}
      >
        {label}
      </Tag>
    );
  };

  return (
    <section className='overflow-hidden mb-10'>
      <div className=''>
        <div className='flex gap-5 w-full'>
          <div className='min-w-50'>
            <Button
              variant='secondary'
              className=' custom-radius flex flex-centered gap-2 w-full font-normal h-11'
              onClick={() => setIsModalOpen(true)}
            >
              <AddIcon /> <p className='font-primary'>Upload</p>
            </Button>
          </div>
          <Input
            size='large'
            placeholder='Search Template Name'
            className='h-11 custom-radius mb-5 w-full'
            onChange={handleSearchChange}
            prefix={
              <div className='pe-3'>
                <SearchIcon />
                {isLoading && (
                  <span className='absolute right-5 top-2'>
                    <Spin indicator={<LoadingOutlined spin />} />
                  </span>
                )}
              </div>
            }
          />
        </div>
        <div className='[&>div>div>div>div>span]:bg-[#d3e9b1] h-16 template-tags-input'>
          <Select
            size='large'
            className='h-full text-center'
            mode='tags'
            allowClear
            tagRender={tagRender}
            style={{ width: '100%' }}
            placeholder='Filter by Tags Name'
            options={options}
            onChange={(value) => {
              handleTagChange(value);
            }}
          />
        </div>
      </div>
      {templateData?.map((temp: any, index: number) => (
        <div
          key={`${temp?.uid}-${index}-templates`}
          className='flex justify-between gap-5 items-center border-b border-border-gray p-4'
        >
          <div className='flex gap-12 text-sm break-words w-[100%]'>
            <div className='flex items-center gap-3'>
              {/* <TemplatesFormIcom /> */}
              <h3 className='whitespace-nowrap overflow-hidden text-ellipsis'>{temp?.name}</h3>
            </div>

            {temp?.tags?.length > 0 && (
              <div className='flex flex-wrap gap-2 m-auto'>
                {temp?.tags.map((tags: any, index: number) => (
                  <span
                    key={index}
                    style={{ color: getTagsColor(tags) }}
                    className={`py-1 text-center rounded-sm text-sm px-6 w-auto`}>{tags}</span>
                ))}
              </div>
            )}
          </div>

          <div className='flex gap-5'>
            <Button variant='text' className='cursor-pointer text-base w-5 h-5' onClick={() => handleDirectDownload(temp?.fileUrl)}>
              <DownloadIcon className='w-full h-full' />
            </Button>
            <Popconfirm
              title='Are you sure to delete?'
              placement='topRight'
              onConfirm={() => handleRemove(temp?.uid)}
              okText='Yes'
              cancelText='No'
              disabled={isDeleteLoading}
            >
              <div className='flex justify-end'>
                <DeleteIcon className='fill-danger cursor-pointer w-5 h-5' />
              </div>
            </Popconfirm>
          </div>
        </div>
      ))}

      <UploadTemplates
        onCancel={handleCancel}
        open={isModalOpen}
        handleUploadDocuments={handleOk}
        uploadLoading={uploadLoading}
      />
    </section>
  );
}

export default Templates;


//Temporary comment code for new Ui