import dayjs from 'dayjs';
import { DatePicker, Divider, Input, Modal, Spin, Upload, Typography, Radio } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Button from 'components/core-ui/button/button';
import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-bg-icon.svg?react';
import FormIcon from 'assets/icons/input-form-icon.svg?react';
import { useEffect, useState } from 'react';
import { invoiceStatus } from 'utils/global.status';
import { splitFileName } from 'components/global/global';

const { Text } = Typography;
const { RangePicker } = DatePicker;

function EditUploadBillingModal({ updateLoading, open, onCancel, handleUploadDocuments, billingData, serviceData }: any) {
  const isJobCoachingOrWorkReadiness = ['Job Coaching', 'Work Readiness Training'].includes(
    serviceData?.data?.caseType?.name || ''
  );
  const [fileList, setFileList] = useState<any[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [paymentDate, setPaymentDate] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState('');
  const [hoursAuthorized, setHoursAuthorized] = useState('');
  const [actualHours, setActualHours] = useState('');
  const [status, setStatus] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState({
    file: false,
    invoiceNumber: false,
    dateRange: false,
    paymentDate: false,
    totalAmount: false,
    status: false,
    hoursAuthorized: false,
    actualHours: false,
  });

  useEffect(() => {
    if (billingData) {
      setFileList(
        billingData?.documents?.map((doc: string, index: number) => ({
          uid: index,
          name: doc,
          url: doc,
        })) || []
      );
      setInvoiceNumber(billingData.invoiceNumber || '');
      setDateRange([
        billingData.startDate ? dayjs(billingData.startDate) : null,
        billingData.endDate ? dayjs(billingData.endDate) : null,
      ]);
      setPaymentDate(billingData.paymentDate ? dayjs(billingData.paymentDate) : null);
      setTotalAmount(billingData?.amount?.toString() || '');
      setHoursAuthorized(billingData?.hoursAuthorized?.toString() || '')
      setActualHours(billingData?.actualHours?.toString() || '')
      setStatus(billingData?.status || 0);
      setDescription(billingData.description || '');
    }
  }, [billingData]);

  const handleUpload = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    setError((prev) => ({ ...prev, file: false }));
  };

  const handleRemove = (uid: any) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== uid));
  };

  const handleOkButton = () => {
    let validationError = {
      file: fileList.length === 0,
      invoiceNumber: invoiceNumber.trim() === '',
      dateRange: !dateRange || !dateRange[0] || !dateRange[1],
      paymentDate: !paymentDate,
      totalAmount: totalAmount.trim() === '',
      status: status === null,
      hoursAuthorized: isJobCoachingOrWorkReadiness ? hoursAuthorized.trim() === '' : false,
      actualHours: isJobCoachingOrWorkReadiness ? actualHours.trim() === '' : false,
    };

    setError(validationError);

    if (Object.values(validationError).every((val) => !val)) {
      handleUploadDocuments(fileList, {
        invoiceNumber,
        dateRange,
        paymentDate,
        totalAmount,
        status,
        description,
        hoursAuthorized,
        actualHours
      });
    }
  };

  const handleFieldChange = (field: string) => {
    setError((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <Modal
      style={{ textAlign: 'center' }}
      onCancel={onCancel}
      centered
      footer={null}
      title={<p className="text-lg">Upload</p>}
      open={open}
    >
      <Divider />
      <div className='flex flex-col'>
        <Upload
          accept=".docx,.pdf"
          showUploadList={false}
          fileList={fileList}
          onChange={handleUpload}
          onRemove={handleRemove}
          beforeUpload={() => false}
          disabled={fileList.length > 0}
        >
          <Button variant="secondary" className="h-11 custom-radius my-3" disabled={fileList.length > 0}>
            <AddIcon /> Add Document
          </Button>
        </Upload>

        {fileList.length > 0 &&
          fileList.map(({ uid, name }) => (
            <div key={uid} className="flex justify-between py-1">
              <div className="flex items-center gap-2 font-semibold">
                <FormIcon /> {splitFileName(name)}
              </div>
              <DeleteIcon className="cursor-pointer" onClick={() => handleRemove(uid)} />
            </div>
          ))}
        {error.file && <Text type="danger" className="text-red-500">Please upload at least one document.</Text>}
      </div>
      {/* Invoice Number Field */}
      <Input
        value={invoiceNumber}
        onChange={(e) => {
          setInvoiceNumber(e.target.value);
          handleFieldChange('invoiceNumber');
        }}
        className="my-3 h-11 custom-radius"
        type='number'
        placeholder="Enter Invoice Number"
      />
      {error.invoiceNumber && <Text type="danger" className="text-red-500">Please enter an invoice number.</Text>}

      {/* Date Range Field */}
      <RangePicker
        value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
        onChange={(dates) => {
          setDateRange(dates);
          handleFieldChange('dateRange');
        }}
        className="my-3 h-11 custom-radius"
        style={{ width: '100%' }}
        placeholder={['Start Date', 'End Date']}
        format='MM-DD-YYYY'
      />
      {error.dateRange && <Text type="danger" className="text-red-500">Please select a date range.</Text>}

      {/* Payment Date Field */}
      <DatePicker
        value={paymentDate ? dayjs(paymentDate) : null}
        onChange={(date) => {
          setPaymentDate(date);
          handleFieldChange('paymentDate');
        }}
        className="my-3 h-11 custom-radius"
        style={{ width: '100%' }}
        placeholder="Payment Date"
        format="MM-DD-YYYY"
      />
      {error.paymentDate && <Text type="danger" className="text-red-500">Please select a payment date.</Text>}

      {/* Total Amount Field */}
      <Input
        value={totalAmount}
        onChange={(e) => {
          setTotalAmount(e.target.value);
          handleFieldChange('totalAmount');
        }}
        type="number"
        className="my-3 h-11 custom-radius"
        placeholder="Enter Total Amount"
      />
      {error.totalAmount && <Text type="danger" className="text-red-500">Please enter the total amount.</Text>}
      {isJobCoachingOrWorkReadiness && (
        <>
          <Input
            value={hoursAuthorized}
            onChange={(e) => {
              setHoursAuthorized(e.target.value);
              handleFieldChange('hoursAuthorized');
            }}
            type='number'
            className='my-3 h-11 custom-radius'
            placeholder='Hours Authorized'
          />
          {error.hoursAuthorized && (
            <Text type='danger' className='text-red-500'>
              Please enter Authorized hours.
            </Text>
          )}

          <Input
            value={actualHours}
            onChange={(e) => {
              setActualHours(e.target.value);
              handleFieldChange('actualHours');
            }}
            type='number'
            className='my-3 h-11 custom-radius'
            placeholder='Hours completed'
          />
          {error.actualHours && (
            <Text type='danger' className='text-red-500'>
              Please enter completed hours.
            </Text>
          )}
        </>
      )}
      {/* Status Radio */}
      <div className="my-3">
        <Radio.Group
          onChange={(e) => {
            setStatus(e.target.value);
            handleFieldChange('status');
          }}
          value={status}
          style={{ width: '100%' }}
          className="flex items-center gap-2"
        >
          <Radio value={invoiceStatus.PAID}>Paid</Radio>
          <Radio value={invoiceStatus.CANCELLED}>Cancelled</Radio>
          <Radio value={invoiceStatus.SENT}>Sent</Radio>
          <Radio value={invoiceStatus.UNPAID}>Unpaid</Radio>
        </Radio.Group>
      </div>
      {error.status && <Text type="danger" className="text-red-500">Please select a status.</Text>}

      {/* Description Field */}
      <TextArea
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        className="my-3 custom-radius"
        style={{ resize: 'none' }}
        rows={3}
        placeholder="Add a description..."
      />

      <div className="flex justify-center gap-3 my-5">
        <Button variant="primary" className="text-base px-20 h-11 custom-radius" onClick={handleOkButton} disabled={updateLoading}>
          {updateLoading ? <Spin className="custom-spin" /> : 'Upload'}
        </Button>
      </div>
    </Modal>
  );
}

export default EditUploadBillingModal;
