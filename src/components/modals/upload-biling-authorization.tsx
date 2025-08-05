import dayjs from 'dayjs';
import { DatePicker, Divider, Modal, Spin, Upload, Typography, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Button from 'components/core-ui/button/button';
import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-bg-icon.svg?react';
import FormIcon from 'assets/icons/input-form-icon.svg?react';
import { useEffect, useState } from 'react';
import { splitFileName } from 'components/global/global';

const { Text } = Typography;
const { RangePicker } = DatePicker;

function UploadBillingAuthorization({ uploadLoading, open, onCancel, handleUploadDocuments, resetTrigger, editModalData, handleUpdate }: any) {
  const [fileList, setFileList] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState({ file: false, date: false, hours: false, invoiceNumber: false, });
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<any>('');

  useEffect(() => {
    if (open) {
      if (editModalData) {
        setFileList(
          (editModalData?.documents?.map((doc: string, index: number) => ({
            uid: index,
            name: doc,
            url: doc,
          })) || []
          ));
        setDescription(editModalData?.description);
        setError({ file: false, date: false, hours: false, invoiceNumber: false, });
        setDateRange([editModalData?.startDate, editModalData?.endDate]);
        setInvoiceNumber(editModalData?.invoiceNumber)
      } else {
        setFileList([]);
        setDescription('');
        setError({ file: false, date: false, hours: false, invoiceNumber: false, });
        setDateRange(null);
        setInvoiceNumber(null)
      }
    }
  }, [resetTrigger, open]);

  const handleUpload = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setError((prev) => ({ ...prev, file: false }));
    }
  };

  const handleRemove = (uid: any) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== uid));
  };

  const handleDateChange = (dates: any) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      setError((prev) => ({ ...prev, date: false }));
    }
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleOkButton = () => {
    let validationError = { file: false, date: false, hours: false, invoiceNumber: false };

    if (fileList.length === 0) {
      validationError.file = true;
    }
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      validationError.date = true;
    }
    if (!invoiceNumber.trim()) {  // Ensure invoice number is not empty
      validationError.invoiceNumber = true;
    }

    setError(validationError);

    if (!validationError.file && !validationError.date && !validationError.invoiceNumber) {
      handleUploadDocuments(fileList, { dateRange, description, invoiceNumber });
    }
  };

  const handleUpdateButton = () => {
    let validationError = {
      file: false, date: false, hours: false, invoiceNumber
        : false
    };
    if (fileList.length === 0) {
      validationError.file = true;
    }
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      validationError.date = true;
    }
    if (!invoiceNumber.trim()) {
      validationError.invoiceNumber = true;
    }
    setError(validationError);
    if (!validationError.file && !validationError.date && !validationError.invoiceNumber) {
      let params = {
        ...editModalData,
        description: description,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
        invoiceNumber: invoiceNumber,
      }
      handleUpdate(fileList, params);
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
      title={<p className="text-lg">Upload Authorization Form</p>}
      open={open}
    >
      <Divider />
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
        fileList.map((file, index) => (
          <div key={index} className="flex justify-between py-1">
            <div className="flex items-center gap-2 font-semibold">
              <FormIcon /> {splitFileName(file.name)}
            </div>
            <DeleteIcon className="cursor-pointer" onClick={() => handleRemove(file.uid)} />
          </div>
        ))}
      <div>
        {error.file && <Text type="danger" className="text-red-500">Please upload at least one document.</Text>}
      </div>

      <Input
        value={invoiceNumber}
        onChange={(e) => {
          setInvoiceNumber(e.target.value);
          handleFieldChange('invoiceNumber');
        }}
        className='my-3 h-11 custom-radius'
        type='number'
        placeholder='Enter Invoice Number'
      />
      {error.invoiceNumber && (
        <Text type='danger' className='text-red-500'>
          Please enter an invoice number.
        </Text>
      )}

      {/* Date Range Field */}
      <RangePicker
        value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
        onChange={handleDateChange}
        className="my-3 h-11 custom-radius"
        style={{ width: '100%' }}
        placeholder={['Start Date', 'End Date']}
        format='MM-DD-YYYY'
      />
      {error.date && (
        <Text type="danger" className="text-red-500">
          Please select a date range.
        </Text>
      )}

      <TextArea
        value={description}
        onChange={handleDescriptionChange}
        className="my-3 custom-radius"
        style={{ resize: 'none' }}
        rows={3}
        placeholder="Add a description..."
      />

      <div className="flex justify-center gap-3 my-5">
        {editModalData ? (
          <Button variant="primary" className="text-base px-20 h-11 custom-radius" onClick={handleUpdateButton} disabled={uploadLoading}>
            {uploadLoading ? <Spin className="custom-spin" /> : 'Update'}
          </Button>
        ) : (
          <Button variant="primary" className="text-base px-20 h-11 custom-radius" onClick={handleOkButton} disabled={uploadLoading}>
            {uploadLoading ? <Spin className="custom-spin" /> : 'Upload'}
          </Button>
        )

        }
      </div>
    </Modal>
  );
}

export default UploadBillingAuthorization;
