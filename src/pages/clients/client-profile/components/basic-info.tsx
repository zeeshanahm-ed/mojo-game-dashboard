import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// import countryList from 'react-select-country-list';
import { DatePicker, Form, Input, Select, Upload } from 'antd';
import moment from 'moment';

import Button from 'components/core-ui/button/button';
import { splitFileName } from 'components/global/global';

import { clientstatus, countyList } from 'utils/clientsUtils';

import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import InputFormIcon from 'assets/icons/input-form-icon.svg?react';
import DownloadIcon from 'assets/icons/templates-download-icon.svg?react';
import FormIcon from 'assets/icons/input-form-icon.svg?react';


function BasicInfo({ isEditMode, initialValues, setFileList, fileList, onChange, form, updateDoc }: any) {
  const [countryValue, setCountryValue] = useState<string>(initialValues.basicInformation.country || '');
  const [clientStatus, setClientStatus] = useState<string>(initialValues.status);
  const handleUpload = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };
  const handleRemove = (uid: any) => {
    setFileList((prevList: any[]) => prevList.filter((item) => item.uid !== uid));
  };
  const changeHandler = (country: string) => {
    setCountryValue(country);
  };
  const changeStatusHandler = (status: any) => {
    setClientStatus(status);
    form.setFieldsValue({ clientStatus: status });
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

  const formattedInitialValues = {
    ...initialValues.basicInformation,
    dob: initialValues.basicInformation.dob ? moment(initialValues.basicInformation.dob) : null,
    referralDate: initialValues.basicInformation.referralDate ? moment(initialValues.basicInformation.referralDate) : null,
  };

  return (
    <Form
      form={form} // Accept form instance from parent
      disabled={!isEditMode}
      layout='vertical'
      name='basic-info'
      initialValues={formattedInitialValues}
      autoComplete='off'
      onValuesChange={(_, values) => onChange(values)}
    >
      <div className='flex gap-3 py-5 flex-col'>
        {initialValues?.basicInformation?.referralDocument?.length > 0 ? (
          <div className='border flex items-center justify-between gap-3 border-border-gray bg-[#F4F3F3] rounded-md py-4 px-4 text-sm font-medium w-full'>
            <div className='flex items-center gap-3'>
              <InputFormIcon />
              {splitFileName(initialValues?.basicInformation?.referralDocument)}
            </div>
            <div className='flex gap-x-3'>
              <DownloadIcon className='cursor-pointer w-6 h-6' onClick={() => handleDirectDownload(initialValues?.basicInformation?.referralDocument)} />
              <DeleteIcon className='cursor-pointer w-6 h-6' onClick={updateDoc} />
            </div>
          </div>
        ) : (
          <div className='flex justify-between'>
            <div className='flex flex-col w-full'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <FormIcon />
                  <p className='text-sm font-medium text-gray-500'>Upload Refferal Form</p>
                </div>
                <Upload
                  accept='.docx,.pdf'
                  showUploadList={false}
                  fileList={fileList}
                  onChange={handleUpload}
                  onRemove={handleRemove}
                  beforeUpload={() => false}
                >
                  <Button
                    variant='secondary'
                    className={`py-3 px-8 gap-2 font-normal ${isEditMode ? 'opacity-100' : 'opacity-50'}`}
                  >
                    <AddIcon /> <p className='font-primary'>Upload</p>
                  </Button>
                </Upload>
              </div>

              <div className={`gap-3 flex-col w-full py-5 ${fileList?.length > 0 ? 'flex' : 'hidden'}`}>
                {fileList?.map(({ uid, name }: any) => (
                  <div
                    key={uid}
                    className='border flex items-center justify-between gap-3 border-border-gray rounded-md py-4 px-4 text-sm font-medium w-full'
                  >
                    <div className='flex items-center gap-3'>
                      <InputFormIcon />
                      {name}
                    </div>
                    <DeleteIcon className='cursor-pointer' onClick={() => handleRemove(uid)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Row 1 */}
      <div className='flex flex-wrap gap-4 justify-between'>
        <Form.Item className='w-full sm:w-[48%] xl:w-[20%]' label='Client Status' name='clientStatus'>
          <Select
            className='h-11 custom-select-bg-color custom-radius'
            size='large'
            options={clientstatus}
            defaultValue={clientStatus}
            onChange={changeStatusHandler}
          />
        </Form.Item>
        <Form.Item className='w-full sm:w-[48%] xl:w-[20%]' label='Client ID' name='clientId' rules={[{ required: true, message: 'Please input your ID!' }]}>
          <Input type='number' className='h-11 bg-[#F4F3F3] custom-radius' />
        </Form.Item>
        <Form.Item
          label='Client Name'
          name='clientName'
          className='w-full sm:w-[48%] xl:w-[25%]'
          rules={[{ required: true, message: 'Please input your Name!' }]}
        >
          <Input className='h-11 bg-[#F4F3F3] custom-radius' />
        </Form.Item>
        <Form.Item
          className='w-full sm:w-[48%] xl:w-[28%]'
          label='Client Email Address'
          name='emailAddress'
          rules={[{ required: true, type: 'email', message: 'Please input a valid Email Address!' }]}
        >
          <Input type='email' className='h-11 bg-[#F4F3F3] custom-radius' />
        </Form.Item>
      </div>

      {/* Row 2 */}
      <div className='flex flex-wrap gap-4 justify-between'>
        <Form.Item
          label='Date of Birth'
          name='dob'
          className='w-full sm:w-[48%] xl:w-[20%]'
          rules={[{ required: true, message: 'Please input your Date of Birth!' }]}
        >
          <DatePicker className='w-full h-11 bg-[#F4F3F3] custom-radius font-primary text-lg' format='MM-DD-YYYY' />
        </Form.Item>
        <Form.Item className='w-full sm:w-[48%] xl:w-[20%]' label='Phone Number' name='phoneNumber'>
          <PhoneInput
            country={'us'}
            onlyCountries={['us']}
            disableDropdown={true}
            enableSearch={false}
            inputProps={{
              className: 'form-control bg-[#F4F3F3]',
              disabled: !isEditMode
            }}
            containerClass="h-11 custom-radius"
          />
        </Form.Item>
        <Form.Item className='w-full sm:w-[48%] xl:w-[25%]' label='Alt Number' name='altNumber'>
          <Input type='number' className='h-11 bg-[#F4F3F3] custom-radius' />
        </Form.Item>
        <Form.Item
          label="Referral Date"
          name="referralDate"
          className="w-full sm:w-[48%] xl:w-[28%]"
          rules={[{ required: true, message: "Please Select Referral Date!" }]}
        >
          <DatePicker
            format="MM/DD/YYYY"
            className="w-full h-11 custom-radius bg-[#F4F3F3]"
          />
        </Form.Item>
      </div>

      {/* Row 3 */}
      <div className='flex flex-wrap gap-4 justify-between items-end'>
        <Form.Item
          label='Home Address'
          name='homeAddress'
          className='w-full md:w-[48%] xl:w-[43%]'
          rules={[{ required: true, message: 'Please enter your home address!' }]}
        >
          <Input className='h-11 bg-[#F4F3F3] custom-radius' />
        </Form.Item>
        <Form.Item className='w-full sm:w-[48%] xl:w-[25%]' label='Parent(s)Guardian Name' name='guardianName'>
          <Input className='h-11 bg-[#F4F3F3] custom-radius' />
        </Form.Item>
        <Form.Item className='w-full sm:w-[48%] xl:w-[28%]' label='Parent(s)Guardian Contact Number' name='guardianContactNumber'>
          <PhoneInput
            country={'us'}
            onlyCountries={['us']}
            disableDropdown={true}
            enableSearch={false}
            inputProps={{
              className: 'form-control bg-[#F4F3F3]',
              disabled: !isEditMode
            }}
            containerClass="h-11 custom-radius"
          />
        </Form.Item>
      </div>


      {/* Row 4 */}
      <div className='flex flex-wrap gap-4 justify-between items-end'>
        <Form.Item className='w-full sm:w-[48%] md:flex-1' label='COUNTY- Drop down of the counties in Georgia,USA' name='country'>
          <Select className='h-11 custom-select-bg-color custom-radius' size='large' options={countyList} value={countryValue} onChange={changeHandler} />
        </Form.Item>
        <Form.Item label="Counselor's Name:" name='counselorName' className='w-full sm:w-[48%] md:flex-1'>
          <Input className='h-11 bg-[#F4F3F3] custom-radius' />
        </Form.Item>
      </div>
      <div className='grid grid-cols-3 gap-x-8'>
      </div>
    </Form>
  );
}

export default BasicInfo;