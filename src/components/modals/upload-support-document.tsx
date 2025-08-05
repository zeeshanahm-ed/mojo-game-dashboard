

import { Divider, Modal, Spin, Upload, Typography } from 'antd';
import { useEffect, useState } from 'react';

import Button from 'components/core-ui/button/button';

import AddIcon from 'assets/icons/add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-bg-icon.svg?react';
import FormIcon from 'assets/icons/input-form-icon.svg?react';
import TextArea from 'antd/es/input/TextArea';
import { splitFileName } from 'components/global/global';



function UploadSupportDocumentModal({ uploadLoading, open, onCancel, handleUploadDocuments, editModalData, singleDeleteLoading, handleUpdate }: any) {

  const [fileList, setFileList] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false); // For validation error

  useEffect(() => {
    if (open) {
      // If editModalData exists, prefill fields with its values
      if (editModalData) {
        setFileList(
          (editModalData?.document?.map((doc: string, index: number) => ({
            uid: index,
            name: doc,
            url: doc,
          })) || []
          ));
        setDescription(editModalData.description || '');
      } else {
        // Reset the state when the resetTrigger or modal state changes
        setFileList([]);
        setDescription('');
        setError(false);
      }
    }
  }, [open]);

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
    handleUpdate(fileList, {
      ...editModalData,
      description: description
    });
  };


  return (
    <Modal
      style={{ textAlign: 'center' }}
      onCancel={onCancel}
      centered
      footer={null}
      title={<p className='text-lg'>Upload</p>}
      open={open}
    >
      <Divider />
      <Upload
        accept='.docx,.pdf'
        showUploadList={false}
        fileList={fileList}
        onChange={handleUpload}
        onRemove={handleRemove}
        beforeUpload={() => false}
        disabled={fileList.length > 0 || uploadLoading}
      >
        <Button variant='secondary' className='h-11 custom-radius my-3' disabled={fileList.length > 0 || uploadLoading}>
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

      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="my-3 custom-radius"
        style={{ resize: 'none' }}
        rows={3}
        placeholder="Add a description..."
      />

      {error && (
        <Typography.Text type="danger" className="text-red-500">
          Please upload at least one document.
        </Typography.Text>
      )}

      {editModalData ? (
        <div className='flex justify-center gap-3 my-5'>
          <Button variant='primary' className='text-base px-20 h-11 custom-radius' onClick={handleUpdateButton}>
            {singleDeleteLoading ? <Spin className='custom-spin' /> : 'Update'}
          </Button>
        </div>
      ) : (
        <div className='flex justify-center gap-3 my-5'>
          <Button variant='primary' className='text-base px-20 h-11 custom-radius' onClick={handleOkButton} disabled={uploadLoading}>
            {uploadLoading ? <Spin className='custom-spin' /> : 'Upload'}
          </Button>
        </div>
      )}
    </Modal>
  );
}

export default UploadSupportDocumentModal;
