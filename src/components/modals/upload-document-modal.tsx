import { useEffect, useState } from 'react';

import { Divider, Modal, Spin, Upload, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import Button from 'components/core-ui/button/button';

import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-bg-icon.svg?react';
import FormIcon from 'assets/icons/input-form-icon.svg?react';
import { splitFileName } from 'components/global/global';

const { Text } = Typography;

function UploadDocumentModal({ uploadLoading, open, onCancel, handleUploadDocuments, resetTrigger, editModalData, handleUpadetDocuments }: any) {
  const [fileList, setFileList] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      if (editModalData) {
        setFileList(
          (editModalData?.document?.map((doc: string, index: number) => ({
            uid: index,
            name: doc,
            url: doc,
          })) || []
          ));
        setDescription(editModalData?.description);
        setError(false);
      } else {
        setFileList([]);
        setDescription('');
        setError(false);

      }
    }
  }, [resetTrigger, open]);

  const handleUpload = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    setError(false);
  };

  const handleRemove = (uid: any) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== uid));
  };

  const handleOkButton = () => {
    if (fileList.length === 0) {
      setError(true);
      return;
    }
    handleUploadDocuments(fileList, description);
  };
  const handleUpdateButton = () => {
    if (fileList.length === 0) {
      setError(true);
      return;
    }
    let data = {
      ...editModalData,
      description: description
    }
    handleUpadetDocuments(fileList, data);
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
      <Upload
        accept=".docx,.pdf"
        showUploadList={false}
        fileList={fileList}
        onChange={handleUpload}
        onRemove={handleRemove}
        disabled={fileList?.length > 0}
        beforeUpload={() => false} // Prevent default upload
      >
        <Button variant="secondary" className="h-11 custom-radius my-3" disabled={fileList?.length > 0}>
          <AddIcon /> Add Document
        </Button>
      </Upload>
      {fileList?.length > 0 &&
        fileList?.map((file, index) => (
          <div key={index} className="flex justify-between py-1">
            <div className="flex items-center gap-2 font-semibold">
              <FormIcon /> {splitFileName(file.name)}
            </div>
            <DeleteIcon className="cursor-pointer" onClick={() => handleRemove(file.uid)} />
          </div>
        ))}


      <div>
        {error && (
          <Text type="danger" className="text-red-500">
            Please upload at least one document.
          </Text>
        )}
      </div>

      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="my-3 custom-radius"
        style={{ resize: 'none' }}
        rows={3}
        placeholder="Add a description..."
      />



      <div className="flex justify-center gap-3 my-5">
        {editModalData ?
          <Button variant="primary" className="text-base px-20 h-11 custom-radius" onClick={handleUpdateButton} disabled={uploadLoading}>
            {uploadLoading ? <Spin className="custom-spin" /> : 'Update'}
          </Button>
          :
          <Button variant="primary" className="text-base px-20 h-11 custom-radius" onClick={handleOkButton} disabled={uploadLoading}>
            {uploadLoading ? <Spin className="custom-spin" /> : 'Upload'}
          </Button>

        }
      </div>
    </Modal>
  );
}

export default UploadDocumentModal;
