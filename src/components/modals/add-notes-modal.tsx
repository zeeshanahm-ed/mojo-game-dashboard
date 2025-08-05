import { useEffect, useState } from 'react';
import { DatePicker, Modal, Spin, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs, { Dayjs } from 'dayjs';

const { Text } = Typography;

function AddNotesModal({ open, onCancel, onOk, isLoading, handleUpdateNote, editModalData }: any) {
  const [note, setNote] = useState('');
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (open) {
      if (editModalData) {
        setNote(editModalData?.description);
        setError(false);
        setSelectedDate(dayjs(editModalData?.createdAt));
      } else {
        setNote('');
        setSelectedDate(null);
      }
    }
  }, [open]);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleOk = () => {
    if (!note.trim()) {
      setError(true);
      return;
    }

    const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : null;

    onOk(note, formattedDate);
    resetState();
  };

  const resetState = () => {
    setNote('');
    setError(false);
    setSelectedDate(null);
  }

  const handleUpdate = () => {
    if (!note.trim()) {
      setError(true);
      return;
    };

    let data = {
      ...editModalData,
      description: note,
    }

    handleUpdateNote(data);
    resetState();
  };

  return (
    <Modal
      title="Add Notes"
      open={open}
      onOk={editModalData ? handleUpdate : handleOk}
      onCancel={onCancel}
      okText={isLoading ? <Spin className="custom-spin" /> : editModalData ? "Update" : 'OK'}
    >
      <div>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          className="my-3 h-11 custom-radius"
          style={{ width: '100%' }}
          format="MM/DD/YYYY"
          placeholder="Select Date"
          disabled={editModalData}
        />
      </div>
      <TextArea
        className="my-6 custom-radius"
        style={{ resize: 'none' }}
        rows={4}
        placeholder="Add Notes..."
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setError(false);
        }}
      />
      {error && (
        <Text type="danger" className="text-red-500">
          Note cannot be empty.
        </Text>
      )}
    </Modal>
  );
}

export default AddNotesModal;
