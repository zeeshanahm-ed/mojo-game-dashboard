import { Upload, Modal, Spin, Typography, Input, Select } from 'antd';
import Button from 'components/core-ui/button/button';
import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-bg-icon.svg?react';
import FormIcon from 'assets/icons/input-form-icon.svg?react';
import { useEffect, useState } from 'react';

const { Text } = Typography;

function UploadTemplates({ uploadLoading, open, onCancel, handleUploadDocuments, resetTrigger }: any) {
  const [fileList, setFileList] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]); // Tags state for Select component
  const [name, setName] = useState('');
  const [error, setError] = useState({ file: false, tag: false, name: false });

  useEffect(() => {
    if (open) {
      setFileList([]);
      setTags([]);
      setName('');
      setError({ file: false, tag: false, name: false });
    }
  }, [resetTrigger, open]);

  const handleUpload = ({ fileList: newFileList }: any) => {
    setFileList(newFileList.slice(-1)); // Allow only one file
    if (newFileList.length > 0) {
      setError((prev) => ({ ...prev, file: false }));
    }
  };

  const handleRemove = () => {
    setFileList([]);
  };

  // Handle tag changes from Select component
  const handleTagChange = (value: string[]) => {
    setTags(value); // Update tags state with selected/created tags
    if (value.length > 0) {
      setError((prev) => ({ ...prev, tag: false }));
    }
  };

  const handleNameChange = (e: any) => {
    setName(e.target.value);
    if (e.target.value.trim() !== '') {
      setError((prev) => ({ ...prev, name: false }));
    }
  };

  const handleOkButton = () => {
    let validationError = { file: false, tag: false, name: false };

    // Validate each field
    if (fileList.length === 0) {
      validationError.file = true;
    }
    if (tags.length === 0) {
      validationError.tag = true;
    }
    if (name.trim() === '') {
      validationError.name = true;
    }

    setError(validationError);

    // If no errors, proceed with the upload
    if (!validationError.file && !validationError.tag && !validationError.name) {
      handleUploadDocuments(fileList, { tags, name });
    }
  };

  return (
    <Modal
      style={{ textAlign: 'center' }}
      onCancel={onCancel}
      centered
      footer={null}
      title={<p className="text-lg">Upload</p>}
      open={open}
      maskClosable={false}
    >
      {/* Upload Document Field */}
      <Upload
        accept=".docx,.pdf"
        showUploadList={false}
        fileList={fileList}
        onChange={handleUpload}
        onRemove={handleRemove}
        beforeUpload={() => false}
      >
        <Button variant="secondary" className="h-11 custom-radius my-3">
          <AddIcon /> Add Document
        </Button>
      </Upload>
      {fileList.length > 0 &&
        fileList.map(({ uid, name }) => (
          <div key={uid} className="flex justify-between py-1">
            <div className="flex items-center gap-2 font-semibold">
              <FormIcon /> {name}
            </div>
            <DeleteIcon className="cursor-pointer" onClick={handleRemove} />
          </div>
        ))}

      {error.file && (
        <div>
          <Text type="danger" className="text-red-500">
            Please upload a document.
          </Text>
        </div>
      )}

      {/* Name Field */}
      <Input
        value={name}
        onChange={handleNameChange}
        className="my-3 h-11 custom-radius"
        placeholder="Enter name..."
      />
      {error.name && (
        <Text type="danger" className="text-red-500">
          Please enter a name.
        </Text>
      )}


      {/* Tag Field using Select with 'tags' mode */}
      <div className="my-3">
        <Select
          mode="tags"
          allowClear
          size="large"
          className="h-auto text-center py-3 custom-radius"
          style={{ width: '100%' }}
          placeholder="Add or Create Tags"
          value={tags}
          options={[
            { value: 'General Forms', label: 'General Forms' },
            { value: 'Supported Employment Forms', label: 'Supported Employment Forms' },
            { value: 'Billing Forms', label: 'Billing Forms' },
            { value: 'Job Coaching Forms', label: 'Job Coaching Forms' },
          ]}
          onChange={handleTagChange}
        />
        {error.tag && (
          <Text type="danger" className="text-red-500">
            Please enter at least one tag.
          </Text>
        )}
      </div>

      <div className="flex justify-center gap-3 my-5">
        <Button variant="primary" className="text-base px-20 h-11 custom-radius" onClick={handleOkButton} disabled={uploadLoading}>
          {uploadLoading ? <Spin className="custom-spin" /> : 'Upload'}
        </Button>
      </div>
    </Modal>
  );
}

export default UploadTemplates;
