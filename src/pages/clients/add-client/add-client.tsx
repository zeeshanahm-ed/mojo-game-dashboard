/* eslint-disable react-hooks/exhaustive-deps */
import { SetStateAction, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import {
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Select,
  Spin,
  TimePicker,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';

import Button from 'components/core-ui/button/button';
import { useHeaderProps } from 'components/core/use-header-props';

import useBack from 'hooks/use-back';

import { clientstatus, countyList } from 'utils/clientsUtils';

import useUploadData from 'pages/services/core/hooks/useUploadData';

import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import FormIcon from 'assets/icons/form-icon.svg?react';
import InputFormIcon from 'assets/icons/input-form-icon.svg?react';
import CollapseIcon from 'assets/icons/collapse-icon-expanded.svg?react';

import useCreateClientData from '../core/hooks/useCreateClientData';

const days = [
  { day: 'Sunday (SUN)' },
  { day: 'Monday (MON)' },
  { day: 'Tuesday (TUE)' },
  { day: 'Wednesday (WED)' },
  { day: 'Thursday (THURS)' },
  { day: 'Friday (FRI)' },
  { day: 'Saturday (SAT)' },
];

function AddClient() {
  const { setTitle, setBack } = useHeaderProps();
  const { handleBack } = useBack();
  const [countryValue, setCountryValue] = useState('');
  const [radioValue, setRadioValue] = useState(1);
  const [documentStatus, setDocumentStatus] = useState("driverLicense");
  const [fileList, setFileList] = useState<any[]>([]);
  const { getSignedUrl } = useUploadData();
  const [clientLoading, setClientLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<any>(null);
  const { mutateAsync: createClient } = useCreateClientData(); const [form] = Form.useForm();

  const onChangeStatus = (e: RadioChangeEvent) => {
    setDocumentStatus(e.target.value);
  };
  const onChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
  };

  const changeHandler = (country: SetStateAction<string>) => {
    setCountryValue(country);
  };

  useEffect(() => {
    setTitle('Add New Client');
    setBack(() => handleBack);
    return () => {
      setBack(undefined);
    };
  }, [setTitle, setBack]);

  const handleUpload = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const handleRemove = (uid: any) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== uid));
  };

  const handleResumeUpload = ({ file }: any) => {
    setResumeFile(file);
    return false;
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
          onError: (error) => {
            console.error('Failed to get signed URL', error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error(`Error handling file ${file.name}`, error);
    }
  };

  // Updated onFinish function to include both specific_time and any_time data
  const onFinish = async (values: any) => {
    setClientLoading(true);
    const s3Keys: string[] = [];
    const resumeS3Keys: string[] = [];

    if (fileList && fileList.length > 0) {
      await uploadFiles(fileList, s3Keys);
    }
    // Process base URLs from fileList
    const baseUrls = s3Keys.map((url) => url.split('?')[0]);
    if (resumeFile) {
      await uploadSingleFile(resumeFile, resumeS3Keys);
    }
    const resumeBaseUrls = resumeS3Keys.map((url) => url.split('?')[0]);

    values.basicInformation['referralDocument'] = baseUrls;
    values.documentInformation['resume'] = resumeBaseUrls;
    const selectedStatus = clientstatus.find(
      (status) => status.value === values.status
    );
    values.status = selectedStatus ? selectedStatus.value : values.status;

    // Format availability data as arrays of timestamps
    const formattedAvailability: Record<string, any> = {};

    Object.keys(values.additionalInformation?.availability || {}).forEach((day) => {
      const dayData = values.additionalInformation.availability[day];

      const now = new Date();
      const defaultStart = new Date(now);
      defaultStart.setHours(0, 0, 0, 0);
      const defaultEnd = new Date(now);
      defaultEnd.setHours(23, 59, 0, 0);

      const defaultTimeRange = [defaultStart.toISOString(), defaultEnd.toISOString()];

      if (dayData && dayData.status) {
        let timeRange = null;

        if (dayData.status === "specific_time" && dayData.timeRange) {
          timeRange = dayData.timeRange;
        } else if (dayData.status === "any_time" && dayData.anyTimeRange) {
          timeRange = dayData.anyTimeRange || defaultTimeRange;
        }

        formattedAvailability[day] = {
          status: dayData.status,
          ...(timeRange ? { timeRange } : {}),
        };
      }
    });

    // Replace the original availability with the formatted one
    if (values.additionalInformation) {
      values.additionalInformation.availability = formattedAvailability
    }

    try {
      await createClient({
        data: values,
        id: '',
      });
      setClientLoading(false);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  return (
    <section className='my-10'>
      <h2 className='font-medium text-2xl mb-5'>Add Client Information</h2>
      <Divider className='border-t-black text-black font-semibold text-lg' orientationMargin={0} orientation='left' plain>
        <span className='flex items-center gap-3'> BASIC INFORMATION <CollapseIcon className='text-black fill-black' /></span>
      </Divider>
      <Form
        form={form}
        layout='vertical'
        name='add-client'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
      >
        {/* Upload Referral form */}
        <div className='flex justify-between mt-5'>
          <div className='flex items-center gap-5'>
            <FormIcon />
            <p className='font-medium text-dark-gray text-lg'>Referral Form</p>
          </div>

          <Upload
            accept='.docx,.pdf'
            showUploadList={false}
            fileList={fileList}
            onChange={handleUpload}
            onRemove={handleRemove}
            beforeUpload={() => false}
          >
            <Button variant='secondary' className='py-3 px-8 gap-2 font-normal'>
              <AddIcon /> <p className='font-primary'>Upload</p>
            </Button>
          </Upload>
        </div>
        <div className='flex gap-3 py-5 flex-col'>
          {fileList.length > 0 &&
            fileList.map(({ uid, name }) => (
              <div
                key={uid}
                className='border flex items-center justify-between gap-3 bg-[#F4F3F3] border-border-gray rounded-md p-4 text-sm font-medium w-full'
              >
                <div className='flex items-center gap-3'>
                  <InputFormIcon />
                  {name}
                </div>
                <DeleteIcon className='cursor-pointer w-5 h-5 ' onClick={() => handleRemove(uid)} />
              </div>
            ))}
        </div>
        {/* Basic Info */}
        <div className="grid gap-x-8 gap-y-6 mb-5 flex-wrap">
          {/* Row 1 */}
          <div className="flex flex-wrap gap-4 justify-between">
            {/* Client Status */}
            <Form.Item
              className="w-full sm:w-[48%] xl:w-[20%]"
              label="Client Status"
              name={["status"]}
            >
              <Select
                className="h-11 custom-radius custom-select-bg-color"
                size="large"
                options={clientstatus}
              />
            </Form.Item>

            {/* Client ID */}
            <Form.Item
              className="w-full sm:w-[48%] xl:w-[20%]"
              label="Client ID"
              name={["basicInformation", "clientId"]}
              rules={[{ required: true, message: "Please input your ID!" }]}
            >
              <Input
                type="number"
                className="h-11 custom-radius bg-[#F4F3F3]"
              />
            </Form.Item>

            {/* Client Name */}
            <Form.Item
              className="w-full sm:w-[48%] xl:w-[25%]"
              label="Client Name"
              name={["basicInformation", "clientName"]}
              rules={[{ required: true, message: "Please input your Name!" }]}
            >
              <Input
                type="text"
                className="h-11 custom-radius bg-[#F4F3F3]"
              />
            </Form.Item>

            {/* Client Email Address */}
            <Form.Item
              className="w-full sm:w-[48%] xl:w-[28%]"
              label="Client Email Address"
              name={["basicInformation", "emailAddress"]}
              rules={[{ required: true, message: "Please input your Email Address!" }]}
            >
              <Input
                type="email"
                className="h-11 custom-radius bg-[#F4F3F3]"
              />
            </Form.Item>
          </div>


          {/* Row 2 */}
          <div className="flex flex-wrap gap-4 justify-between">
            <Form.Item
              label="Date of Birth"
              name={["basicInformation", "dob"]}
              className="w-full sm:w-[48%] xl:w-[20%]"
              rules={[{ required: true, message: "Please input your Date of Birth!" }]}
            >
              <DatePicker
                placeholder="Select Date of Birth"
                format="MM/DD/YYYY"
                className="w-full h-11 font-primary text-lg custom-radius bg-[#F4F3F3]"
              />
            </Form.Item>

            <Form.Item
              className="w-full sm:w-[48%] xl:w-[20%]"
              label="Phone Number"
              name={["basicInformation", "phoneNumber"]}
              rules={[{ required: true, message: "Please input your Phone Number!" }]}
            >
              <PhoneInput
                country={'us'}
                onlyCountries={['us']}
                disableDropdown={true}
                enableSearch={false}
                inputProps={{
                  className: 'form-control bg-[#F4F3F3]'
                }}
                containerClass="h-11 custom-radius"
              />
            </Form.Item>

            <Form.Item
              className="w-full sm:w-[48%] xl:w-[25%]"
              label="Alt Number"
              name={["basicInformation", "altNumber"]}
              rules={[{ required: false }]}
            >
              <Input type="number" className="h-11 custom-radius bg-[#F4F3F3]" />
            </Form.Item>
            <Form.Item
              label="Referral Date"
              name={["basicInformation", "referralDate"]}
              className="w-full sm:w-[48%] xl:w-[28%]"
              rules={[{ required: true, message: "Please Select Referral Date!" }]}
            >
              <DatePicker
                placeholder="Select Referral Date"
                format="MM/DD/YYYY"
                className="w-full h-11 font-primary text-lg custom-radius bg-[#F4F3F3]"
              />
            </Form.Item>
          </div>

          {/* Row 3 */}
          <div className="flex flex-wrap gap-4 justify-between items-end">
            <Form.Item
              label="Home Address"
              className="w-full md:w-[48%] xl:w-[43%]"
              name={["basicInformation", "homeAddress"]}
              rules={[{ required: true, message: "Please input your Home Address!" }]}
            >
              <Input type="text" className="h-11 custom-radius bg-[#F4F3F3]" />
            </Form.Item>

            <Form.Item
              className="w-full sm:w-[48%] xl:w-[25%]"
              label="Parent(s)/Guardian Name"
              name={["basicInformation", "guardianName"]}
            >
              <Input className="h-11 custom-radius bg-[#F4F3F3]" />
            </Form.Item>

            <Form.Item
              className="w-full sm:w-[48%] xl:w-[28%]"
              label="Parent(s)/Guardian Contact Number"
              name={["basicInformation", "guardianContactNumber"]}
            >
              <PhoneInput
                country={'us'}
                onlyCountries={['us']}
                disableDropdown={true}
                enableSearch={false}
                inputProps={{
                  className: 'form-control bg-[#F4F3F3]'
                }}
                containerClass="h-11 custom-radius"
              />
              {/* <Input type="number" className="h-11 custom-radius bg-[#F4F3F3]" /> */}
            </Form.Item>
          </div>

          {/* Row 4 */}
          <div className="flex flex-wrap gap-4 justify-between items-end">
            <Form.Item
              className="w-full sm:w-[48%] md:flex-1"
              label="COUNTY - Drop down of the counties in Georgia, USA"
              name={["basicInformation", "country"]}
            >
              <Select
                className="h-11 custom-select-bg-color custom-radius"
                size="large"
                options={countyList}
                value={countryValue}
                onChange={changeHandler}
              />
            </Form.Item>

            <Form.Item
              className="w-full sm:w-[48%] md:flex-1"
              label="Counselor's Name"
              name={["basicInformation", "counselorName"]}
            >
              <Input className="h-11 custom-radius bg-[#F4F3F3]" />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name={['clientInformation', 'clientDisability']}
          label={
            <div className='flex gap-4 pb-2 font-medium'>
              <span className='border-2 border-light-gray rounded-full flex flex-centered min-w-8 h-8'>1</span>What is
              (are) the Client Disability or Disabilities?
            </div>
          }
        >
          <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
        </Form.Item>
        <Form.Item
          name={['clientInformation', 'limitations']}
          label={
            <div className='flex gap-4 pb-2 font-medium'>
              <span className='border-2 border-light-gray rounded-full flex flex-centered min-w-8 h-8'>2</span>
              Work Impact:
            </div>
          }
        >
          <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
        </Form.Item>
        <Form.Item
          label={
            <p className='font-medium'>
              Barriers & Support Needs (Legal Barriers / Accommudations / Medical / Bchavioral / Sensory)
            </p>
          }
          name={['clientInformation', 'anyAdditionalInformation']}
        >
          <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
        </Form.Item>

        <Divider className='border-t-black text-black font-semibold text-lg' orientationMargin={0} orientation='left' plain>
          Work Readiness
        </Divider>
        {/* Resuma Uploader */}
        <div className='flex items-center gap-6 py-4 mb-4'>
          <Form.Item className='mb-0' label='Resume' name={['documentInformation', 'resume']}>
            <Upload
              accept='.docx,.pdf'
              fileList={resumeFile ? [resumeFile] : []}
              onChange={handleResumeUpload}
              beforeUpload={handleResumeUpload}
              showUploadList={false}

            >
              <Button variant='secondary' className='py-3 px-8 gap-2 font-normal'>
                <AddIcon /> <p className='font-primary'>Upload</p>
              </Button>
            </Upload>
          </Form.Item>

          {resumeFile && (
            <div className='text-light-gray mt-8' key={resumeFile.uid}>
              {resumeFile.name}
            </div>
          )}
        </div>

        {/* Job History */}
        <Form.Item label={<p className='font-semibold'>Job History</p>} name={['documentInformation', 'jobHistory']}>
          <TextArea style={{ resize: 'none' }} rows={2} className='custom-radius' />
        </Form.Item>

        {/* Driver License */}
        <h3 className='font-semibold text-lg pt-5'>Driver&apos;s License</h3>
        <Form.Item name={['documentInformation', 'documentStatus']} className='hidden'>
          <Radio.Group className='py-5' onChange={onChangeStatus} value={documentStatus}>
            {/* <Radio value='idCard'>Identification Card</Radio> */}
            {/* <Radio value='driverLicense'>Driver&rsquo;s License</Radio> */}
          </Radio.Group>
        </Form.Item>
        {documentStatus && (
          <Form.Item
            name={['documentInformation', documentStatus]}
          >
            <Radio.Group className='py-5' onChange={onChange} value={radioValue}>
              <Radio value='valid'>Valid</Radio>
              <Radio value='expired'>Expired</Radio>
              <Radio value='looking to obtain'>No,Looking to obtain</Radio>
            </Radio.Group>
          </Form.Item>
        )}

        {/* Birth Certificate & Security Card */}
        <div className='flex items-center justify-between flex-wrap'>
          <Form.Item
            name={['documentInformation', 'originalSecurityCardAccess']}
            label={<h3 className='font-semibold text-lg'>Access to Original Social Security Card</h3>}
          >
            <Radio.Group className='py-5'>
              <Radio value='yes'>Yes</Radio>
              <Radio value='no'>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            // className=' basis-1/4'
            name={['documentInformation', 'birthCertificate']}
            label={<h3 className='font-semibold text-lg'>Access to Birth Certificate</h3>}
          >
            <Radio.Group className='py-5'>
              <Radio value='yes'>Yes</Radio>
              <Radio value='no'>No</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        {/* SSI or Other Benefits */}
        <div className='flex justify-between flex-col xl:flex-row flex-wrap gap-x-20'>
          <Form.Item
            label={<h3 className='font-semibold text-lg'>Receive SSI or Other Benefits</h3>}
            name={['documentInformation', 'ssiBenefits']}
          >
            <Radio.Group className='py-5'>
              <Radio value='yes'>Yes</Radio>
              <Radio value='no'>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues?.documentInformation?.ssiBenefits !== currentValues?.documentInformation?.ssiBenefits
            }
          >
            {({ getFieldValue }) =>
              getFieldValue(['documentInformation', 'ssiBenefits']) === 'yes' ? (
                <Form.Item
                  className='flex-1'
                  name={['documentInformation', 'ssiBenefitExplain']}
                >
                  <TextArea style={{ resize: 'none' }} rows={1} placeholder='Benefits' className='custom-radius' />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </div>

        {/* Job Type */}
        <div className='flex items-center justify-between flex-wrap'>
          <Form.Item
            name={['documentInformation', 'employmentPreference']}
            label={<h3 className='font-semibold text-lg'>Employment Preference</h3>}
          >
            <Radio.Group className='py-5'>
              <Radio value='fullTime'>Full Time</Radio>
              <Radio value='partTime'>Part Time</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={<h3 className='font-semibold text-lg'>Preferred Shift</h3>}
            name={['documentInformation', 'preferredShift']}
          >
            <Radio.Group className='py-5 gap-5'>
              <Radio value='1st Shift'>1st Shift</Radio>
              <Radio value='2nd Shift'>2nd Shift</Radio>
              <Radio value='3rd Shift'>3rd Shift</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <Form.Item
          label={<p className='font-semibold'>Transportation Plan</p>}
          name={['additionalInformation', 'transportationPlans']}
        >
          <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
        </Form.Item>

        {/* Availability */}
        <h3 className='font-medium text-lg pb-8'>
          Availability <span className='text-light-gray ml-5'>Times Available</span>
        </h3>
        <div className='grid gap-x-10 mb-6'>
          {days.map(({ day }) => (
            <div key={day} className="pb-4">
              <div className="text-lg flex flex-wrap gap-5 items-center">
                <p className="w-[25%] min-w-[250px]">{day}</p>
                <Form.Item name={["additionalInformation", "availability", day, "status"]} className="mb-0">
                  <Select
                    className="w-[210px]"
                    size="large"
                    placeholder="Select availability"
                    options={[
                      { value: "not_available", label: "Not Available" },
                      { value: "any_time", label: "Any Time" },
                      { value: "specific_time", label: "Specific Time" },
                    ]}
                    onChange={(value) => {
                      // Reset time values when changing status
                      form.setFieldsValue({
                        additionalInformation: {
                          availability: {
                            [day]: {
                              status: value,
                              timeRange: null,
                              anyTimeRange: null,
                            },
                          },
                        },
                      })
                      // Force form to rerender
                      form.validateFields([["additionalInformation", "availability", day, "status"]])
                    }}
                  />
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => {
                    return (
                      prevValues?.additionalInformation?.availability?.[day]?.status !==
                      currentValues?.additionalInformation?.availability?.[day]?.status
                    )
                  }}
                >
                  {({ getFieldValue }) => {
                    const status = getFieldValue(["additionalInformation", "availability", day, "status"])

                    if (status === "specific_time") {
                      return (
                        <div>
                          <Form.Item
                            name={["additionalInformation", "availability", day, "timeRange"]}
                            labelCol={{ span: 24 }}
                            className="m-0"
                          >
                            <TimePicker.RangePicker
                              size="large"
                              format="h:mm A"
                              inputReadOnly
                              allowClear={false}
                              minuteStep={1}
                              use12Hours
                              placeholder={["Start Time", "End Time"]}
                              style={{ width: "100%", maxWidth: "210px", borderRadius: '3px' }}
                            />
                          </Form.Item>
                        </div>
                      )
                    }
                    else if (status === "any_time") {
                      return (
                        <div>
                          <Form.Item
                            name={["additionalInformation", "availability", day, "anyTimeRange"]}
                            labelCol={{ span: 24 }}
                            className="m-0"
                          >
                          </Form.Item>
                        </div>
                      )
                    }

                    return null
                  }}
                </Form.Item>
              </div>
            </div>
          ))}
        </div>

        {/* Work Details */}
        <h3 className='font-semibold text-lg pb-8'>Work Details</h3>
        <div className='flex items-center gap-5'>
          <Form.Item name={['additionalInformation', 'workDetails', 'desiredWage']} className='custom-form-class mb-0'>
            <div className='text-base'>Desired Wage</div>
            <Input prefix='$' type='number' className='w-50 no-arrows h-11 custom-radius' />
          </Form.Item>
          <Form.Item name={['additionalInformation', 'workDetails', 'preferredHours']} className='custom-form-class mb-0'>
            <div className='text-base'>Preferred Hours</div>
            <Input suffix='Hours' type='number' className='w-50 no-arrows h-11 custom-radius' />
          </Form.Item>
        </div>

        {/* Assistance Need Options */}
        <div>
          <h3 className='font-semibold text-lg py-6'>Assistance Needs </h3>
          <Form.Item name={['additionalInformation', 'assistanceNeeds', 'selfAdvocacy']}>
            <Radio.Group className='flex gap-8'>
              <p className='text-lg w-60'>Self-Advocacy </p>
              <div>
                <Radio value='yes'>Yes</Radio>
                <Radio value='no'>No</Radio>
              </div>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={['additionalInformation', 'assistanceNeeds', 'applications']}>
            <Radio.Group className='flex gap-8'>
              <p className='text-lg w-60'>Applications</p>
              <div>
                <Radio value='yes'>Yes</Radio>
                <Radio value='no'>No</Radio>
              </div>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={['additionalInformation', 'assistanceNeeds', 'interviewsPrep']}>
            <Radio.Group className='flex gap-8'>
              <p className='text-lg w-60'>Interview Prep</p>
              <div>
                <Radio value='yes'>Yes</Radio>
                <Radio value='no'>No</Radio>
              </div>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={['additionalInformation', 'assistanceNeeds', 'supportInterviews']}>
            <Radio.Group className='flex gap-8'>
              <p className='text-lg w-60'>Support in Interviews</p>
              <div>
                <Radio value='yes'>Yes</Radio>
                <Radio value='no'>No</Radio>
              </div>
            </Radio.Group>
          </Form.Item>
        </div>

        {/* Potential Jobs */}
        <Form.Item
          label={
            <h3 className='font-medium'>
              Potential Jobs <span className='text-light-gray text-base ml-5'>If Identified</span>
            </h3>
          }
          name={['additionalInformation', 'potentialJobs']}
        >
          <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
        </Form.Item>
        {/* Additional Comments */}
        <Form.Item
          label={<h3 className='font-medium'>Additional Comments/Notes:</h3>}
          name={['additionalInformation', 'notes']}
        >
          <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
        </Form.Item>

        {/* BUttons */}
        <div className='flex flex-centered gap-5'>
          <Form.Item>
            <Button onClick={handleBack} className='bg-transparent text-black border w-56 justify-center border-border-gray py-2 text-lg font-normal px-12 transition'>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type='submit' className='py-2 text-lg font-normal justify-center px-12 w-56 text-center'>
              {clientLoading ? <Spin className='custom-spin' /> : 'Create'}
            </Button>{' '}
          </Form.Item>
        </div>

      </Form>
    </section>
  );
}

export default AddClient;
