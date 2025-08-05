import { useEffect, useState } from 'react';

import { Divider, Form, Input, Radio, Select, TimePicker, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RadioChangeEvent } from 'antd/es/radio';
import moment from 'moment';
import dayjs from 'dayjs';
import Button from 'components/core-ui/button/button';
import { splitFileName } from 'components/global/global';
import AddIcon from 'assets/icons/add-icon.svg?react';
import InputFormIcon from 'assets/icons/input-form-icon.svg?react';
import DownloadIcon from 'assets/icons/templates-download-icon.svg?react';
// import DeleteIcon from 'assets/icons/delete-icon.svg?react';

const days = [
  { day: 'Sunday (SUN)' },
  { day: 'Monday (MON)' },
  { day: 'Tuesday (TUE)' },
  { day: 'Wednesday (WED)' },
  { day: 'Thursday (THURS)' },
  { day: 'Friday (FRI)' },
  { day: 'Saturday (SAT)' },
];

function OtherInfo({ resumeFile, setResumeFile, isEditMode, initialValues, onChange }: any) {
  const [radioValue, setRadioValue] = useState<number | string>(1);
  const [documentStatus, setDocumentStatus] = useState("documentStatus");
  const [form] = Form.useForm();
  const [resumeList, setResumeList] = useState<any[]>([]);

  useEffect(() => {
    if (initialValues) {
      const availability = initialValues.additionalInformation?.availability || {};
      const formattedAvailability = Object.keys(availability).reduce((acc: Record<string, any>, day) => {
        const times = availability[day];
        if (Array.isArray(times)) {
          acc[day] = times.map((time: moment.MomentInput) => (time ? moment(time) : null));
        } else {
          acc[day] = times;
        }
        return acc;
      }, {});

      setDocumentStatus(initialValues?.documentInformation?.documentStatus || "documentStatus");
      setRadioValue(initialValues?.documentInformation?.driverLicense || 1); // Fallback to 1 if undefined

      form.setFieldsValue({
        ...initialValues,
        additionalInformation: {
          ...initialValues.additionalInformation,
          availability: formattedAvailability,
        },
      });
      if (initialValues?.documentInformation?.resume) {
        setResumeList(initialValues.documentInformation.resume);
      }
    }
  }, [initialValues, form]);
  const handleRemove = (uid: any) => {
    setResumeFile((prevList: any[]) => prevList.filter((item) => item.uid !== uid));
  };
  const onChangeStatus = (e: RadioChangeEvent) => {
    setDocumentStatus(e.target.value);
  };
  const onRadioChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
  };
  const handleDirectDownload = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', splitFileName(fileUrl));
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl); // Clean up the URL
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };

  const handleResumeUpload = async ({ file }: any) => {
    setResumeFile(file);
    return false;
  };

  return (
    <Form
      form={form}
      disabled={!isEditMode}
      layout='vertical'
      name='other-info'
      initialValues={initialValues}
      onValuesChange={(_, allValues) => {
        onChange(allValues); // Pass the updated values to the parent onChange handler
      }}
    >

      <Form.Item
        label={
          <div className='flex gap-4 pb-2 font-medium'>
            <span className='border-2 border-light-gray rounded-full flex flex-centered min-w-8 h-8'>1</span>
            What is (are) the Client Disability or Disabilities?
          </div>
        }
        name={['clientInformation', 'clientDisability']}
      >
        <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
      </Form.Item>

      <Form.Item
        label={
          <div className='flex gap-4 pb-2 font-medium'>
            <span className='border-2 border-light-gray rounded-full flex flex-centered min-w-8 h-8'>2</span>
            Work Impact:
          </div>
        }
        name={['clientInformation', 'limitations']}
      >
        <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
      </Form.Item>

      <Form.Item
        label={<p className=' font-medium'>Barriers & Support Needs (Legal Barriers / Accommudations / Medical / Bchavioral / Sensory)</p>}
        name={['clientInformation', 'anyAdditionalInformation']}
      >
        <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
      </Form.Item>

      <Divider className='text-black font-semibold text-lg' orientationMargin={0} orientation='left' plain>
        Work Readiness
      </Divider>

      <div className='flex gap-3  flex-col w-full mb-3 ' >
        {resumeList?.length > 0 ? (
          resumeList?.map((doc: any) => (
            <div
              key={doc + 'docu'}
              className='border flex items-center justify-between gap-3 border-border-gray rounded-md py-4 px-4 text-sm font-medium w-full'
            >
              <div className='flex items-center gap-3'>
                <InputFormIcon />
                {splitFileName(doc)}
              </div>
              <div className='flex gap-x-3'>
                <DownloadIcon className='cursor-pointer w-5 h-5' onClick={() => handleDirectDownload(doc)} />

                {/* <DeleteIcon className='cursor-pointer w-5 h-5' onClick={() => handleDeleteResume("initialResume")} /> */}
              </div>
            </div>
          ))
        ) : (
          <div>
            <div className='flex items-center gap-2 w-full my-2'>
              <p className='font-semibold'>Resume</p>
              <p className='ml-8 text-base text-light-gray'>if you have resume then upload it , other wise leave it.</p>
            </div>
            <div className={`flex items-center gap-5 py-2 `}>
              <Form.Item
                name={['documentInformation', 'resume']}
                className='m-0'
              >
                <Upload
                  accept='.docx,.pdf'
                  fileList={resumeFile ? [resumeFile] : []}
                  onChange={handleResumeUpload}
                  onRemove={handleRemove}
                  showUploadList={false}
                >
                  <Button
                    variant='secondary'
                    className={`py-3 px-8 gap-2 font-normal ${isEditMode ? 'opacity-100' : 'opacity-50'}`}
                  >
                    {
                      <>
                        <AddIcon />
                        <p className='font-primary'>Upload</p>{' '}
                      </>
                    }
                  </Button>
                </Upload>
              </Form.Item>
              {Object.keys(resumeFile || {}).length > 0 && (
                <div className='flex gap-3 w-full justify-between items-center p-3'>
                  <div className='flex items-center gap-3'>
                    <InputFormIcon />
                    {resumeFile?.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Form.Item label={<p className='font-semibold'>Job History</p>} name={['documentInformation', 'jobHistory']}>
        <TextArea style={{ resize: 'none' }} rows={2} className='custom-radius' />
      </Form.Item>

      <h3 className='font-semibold text-lg pt-5'>Driver&apos;s License:</h3>
      <Form.Item name={['documentInformation', 'documentStatus']} className='hidden'>
        <Radio.Group className='py-5' onChange={onChangeStatus} value={documentStatus}>
        </Radio.Group>
      </Form.Item>

      {/* Conditionally render the status options based on the selected document type */}
      {
        documentStatus && (
          <Form.Item name={['documentInformation', documentStatus]} >
            <Radio.Group className='py-5' onChange={onRadioChange} value={radioValue}>
              <Radio value='valid'>Valid</Radio>
              <Radio value='expired'>Expired</Radio>
              <Radio value='no,looking to obtain'>No, Looking to obtain</Radio>
            </Radio.Group>
          </Form.Item>
        )
      }


      <div className='flex items-center justify-between flex-wrap'>
        <Form.Item
          label={<h3 className='font-semibold text-lg'>Access to Original Social Security Card:</h3>}
          name={['documentInformation', 'originalSecurityCardAccess']}
        >
          <Radio.Group className='py-5'>
            <Radio value='yes'>Yes</Radio>
            <Radio value='no'>No</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name={['documentInformation', 'birthCertificate']}
          label={<h3 className='font-semibold text-lg'>Access to Birth Certificate:</h3>}
        >
          <Radio.Group className='py-5'>
            <Radio value='yes'>Yes</Radio>
            <Radio value='no'>No</Radio>
          </Radio.Group>
        </Form.Item>
      </div>

      <div className='flex items-center justify-between flex-wrap'>
        <Form.Item
          label={<p className='font-semibold text-lg'>Receive SSI or Other Benefits</p>}
          name={['documentInformation', 'ssiBenefits']}
        >
          <Radio.Group className='py-5'>
            <Radio value='yes'>Yes</Radio>
            <Radio value='no'>No</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues?.documentInformation?.ssiBenefits !== currentValues?.documentInformation?.ssiBenefits}
        >
          {({ getFieldValue }) => getFieldValue(['documentInformation', 'ssiBenefits']) === 'yes' ? (
            <Form.Item
              className='w-9/12'
              name={['documentInformation', 'ssiBenefitExplain']}
            >
              <TextArea placeholder='Benefits' style={{ resize: 'none' }} rows={1} className='custom-radius' />
            </Form.Item>
          ) : null
          }
        </Form.Item>
      </div>

      <div className='flex items-center justify-between flex-wrap'>
        <Form.Item
          label={<h3 className='font-semibold text-lg'>Employment Preference</h3>}
          name={['documentInformation', 'employmentPreference']}
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
          <Radio.Group
            className="py-5 flex gap-5"
          >
            <Radio value="1st Shift">1st Shift</Radio>
            <Radio value="2nd Shift">2nd Shift</Radio>
            <Radio value="3rd Shift">3rd Shift</Radio>
          </Radio.Group>
        </Form.Item>
      </div>

      <Form.Item
        label={<p className='font-semibold'>Transportation Plan</p>}
        name={['additionalInformation', 'transportationPlans']}
      >
        <TextArea style={{ resize: 'none' }} rows={1} className='custom-radius' />
      </Form.Item>

      <h3 className='font-semibold text-lg pb-8'>
        Availability <span className='text-light-gray ml-5'>Times Available</span>
      </h3>

      <div className='grid gap-x-10 mb-6'>
        {days.map(({ day }) => (
          <div key={day} className="pb-4">
            <div className="text-lg font-normal flex flex-wrap gap-5 items-center">
              <p className="w-[23%] min-w-[250px]">{day}</p>

              {/* Status Selector */}
              <Form.Item
                noStyle
                name={["additionalInformation", "availability", day, "status"]}
                shouldUpdate={(prevValues: any, currentValues: any) =>
                  prevValues?.additionalInformation?.availability?.[day]?.status !==
                  currentValues?.additionalInformation?.availability?.[day]?.status
                }
              >
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
                    const updatedFields: any = {
                      status: value,
                      timeRange: null,
                    };

                    form.setFieldsValue({
                      additionalInformation: {
                        availability: {
                          [day]: updatedFields,
                        },
                      },
                    });

                    form.validateFields([["additionalInformation", "availability", day, "status"]]);
                  }}
                />
              </Form.Item>

              {/* Time Range Picker for specific_time only */}
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues?.additionalInformation?.availability?.[day]?.status !==
                  currentValues?.additionalInformation?.availability?.[day]?.status
                }
              >
                {({ getFieldValue }) => {
                  const currentStatus = getFieldValue(["additionalInformation", "availability", day, "status"]);
                  if (currentStatus !== "specific_time") return null;

                  return (
                    <Form.Item
                      key={day}
                      name={["additionalInformation", "availability", day, "timeRange"]}
                      className="m-0"
                    >
                      <div className="text-lg font-medium flex gap-3 items-center">
                        <TimePicker.RangePicker
                          size="large"
                          format="h:mm A"
                          inputReadOnly
                          allowClear
                          minuteStep={1}
                          use12Hours
                          style={{ width: "100%", maxWidth: "220px", borderRadius: '3px' }}
                          defaultValue={
                            initialValues?.additionalInformation?.availability?.[day]?.timeRange
                              ? initialValues.additionalInformation.availability[day].timeRange.map((time: any) =>
                                time ? dayjs(time) : null
                              ) as [dayjs.Dayjs | null, dayjs.Dayjs | null]
                              : undefined
                          }
                          onChange={(time) => {
                            if (!time) return;
                            form.setFieldsValue({
                              additionalInformation: {
                                availability: {
                                  [day]: {
                                    status: currentStatus,
                                    timeRange: time,
                                  },
                                },
                              },
                            });
                            onChange?.({
                              additionalInformation: {
                                availability: {
                                  ...initialValues?.additionalInformation?.availability,
                                  [day]: {
                                    status: currentStatus,
                                    timeRange: time,
                                  },
                                },
                              },
                            });
                          }}
                        />
                      </div>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </div>
          </div>
        ))}

      </div>
      <h3 className='font-semibold text-lg pb-8'>Work Details</h3>
      <div className='flex items-center gap-5 flex-wrap'>
        <Form.Item name={['additionalInformation', 'workDetails', 'desiredWage']} className='custom-form-class mb-0'>
          <div className='text-base w-[140px]'>Desired Wage</div>
          <Input prefix='$' type='number' className='w-50 no-arrows h-11 custom-radius' />
        </Form.Item>
        <Form.Item name={['additionalInformation', 'workDetails', 'preferredHours']} className='custom-form-class mb-0'>
          <div className='text-base w-[140px]'>Preferred Hours</div>
          <Input suffix='Hours' type='number' className='w-50 no-arrows h-11 custom-radius' />
        </Form.Item>
      </div>
    </Form >
  );
}

export default OtherInfo;
