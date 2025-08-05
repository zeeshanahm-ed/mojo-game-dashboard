/* eslint-disable react/no-array-index-key */
import { useState } from 'react';

import { Avatar, Popconfirm, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';

import Button from 'components/core-ui/button/button';
import AddNotesModal from 'components/modals/add-notes-modal';

import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';

import AddIcon from 'assets/icons/add-icon.svg?react';
import CopyIcon from 'assets/icons/copy-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-white-icon.svg?react';
import NoteIcon from 'assets/icons/notes-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';


import useCaseDataDelete from '../core/hooks/useCaseDataDelete';
import useCreateCase from '../core/hooks/useCreateCase';
import moment from 'moment';
import useDeleteSingleDocument from '../core/hooks/useDeleteSingleDocument';
import useDeleteAllNotes from '../core/hooks/useDeleteAllNotes';


function AddNotes({
  phase,
  serviceData,
  caseDataType,
  caseDataSubType,
  refetchCaseData,
  caseDocumentsNote,
}: any) {
  const [addNotesModal, setAddNotesModal] = useState(false);
  const [editModalData, setEditModalData] = useState('');
  const { deleteCaseData, isDeletingCase } = useCaseDataDelete();
  const { deletAllNotes } = useDeleteAllNotes();
  const { createCaseMutate, isCreateCaseLoading } = useCreateCase();
  const { deleteSingleDocument } = useDeleteSingleDocument();
  const [showMoreDescription, setShowMoreDescription] = useState<{ showMoreDesId: string | number; show: boolean; less: boolean }>({
    showMoreDesId: "",
    show: false,
    less: false
  });


  const showAddNotesModal = (data: any) => {
    setAddNotesModal(true);
    setEditModalData(data)
  };
  const handleCancel = () => {
    setAddNotesModal(false);
    setEditModalData('')

  };

  const handleAddNote = (note: string, selectedDate: any) => {
    if (note) {
      const clientServiceData = {
        client: serviceData?.data?.client?._id,
        case: serviceData?.data?._id,
        caseDataType: caseDataType,
        caseDataSubType: caseDataSubType,
        phase: phase,
      };
      const caseData = {
        ...clientServiceData,
        description: note,
        createdAt: selectedDate
      };
      createCaseMutate(caseData, {
        onSuccess: async () => {
          showSuccessMessage('Notes added successfully');
          refetchCaseData();
          setAddNotesModal(false);
        },
        onError: (error) => {
          showErrorMessage('Error while adding notes!');
          console.error('Failed to get signed URL', error);
        },
      });
    }
  };


  const handleUpdateNote = (data: any) => {
    if (data) {
      deleteSingleDocument(
        { id: data._id || '', body: data },
        {
          onSuccess: () => {
            refetchCaseData();
            showSuccessMessage('Updated Successfully!');
            handleCancel()
          },
          onError: (error) => {
            console.error('Update error', error);
            showErrorMessage('Error while updating!');
            handleCancel();
          },
        }
      );
    }
  };

  const handleRemoveNote = (id: string) => {
    deleteCaseData(id, {
      onSuccess: () => {
        refetchCaseData();
        showSuccessMessage(
          'Deleted successfully!'
        );
      },
      onError: (error) => {
        console.error('Delete error', error);
        showErrorMessage(
          'Error while deleting note!'
        );
      },
    }
    );
  };


  const handleRemoveAllNote = () => {

    const payload = {
      ids: caseDocumentsNote?.map((v: any) => v._id) || [],
    };

    deletAllNotes(payload, {
      onSuccess: () => {
        refetchCaseData();
        showSuccessMessage(
          'All notes deleted successfully!'
        );
      },
      onError: (error) => {
        console.error('Delete error', error);
        showErrorMessage(
          'Error while deleting all notes!'
        );
      },
    }
    );
  };

  const handleCopyNote = (note: string) => {
    copy(note);
    setTimeout(() => 2000);
  };

  const handleCopyAllNotes = (caseDocumentsNote: any) => {

    const allNotes = caseDocumentsNote
      .map((note: any) => {
        const date = moment(note?.createdAt).format('MM-DD-YYYY');
        return `${date} - ${note.description}`;
      })
      .join('\n'); // Join all notes with a newline

    copy(allNotes);

    setTimeout(() => {
    }, 2000);
  };

  const handleViewLess = (index: number) => {
    setShowMoreDescription({
      showMoreDesId: index,
      show: false,
      less: true
    });
  };
  const handleViewMore = (index: number) => {
    setShowMoreDescription({
      showMoreDesId: index,
      show: true,
      less: false
    })
  };

  return (
    <section>
      <div className='flex items-center justify-between gap-5 mb-3'>
        <Button variant='secondary' className='text-sm gap-3 h-11 custom-radius px-8' onClick={() => showAddNotesModal("")}>
          <AddIcon /> Add Note
        </Button>
        {caseDocumentsNote?.length > 0 && (
          <div className='flex items-center gap-4'>
            {/* <div className="flex items-center border rounded-md px-2 ml-auto justify-self-end">
              <DatePickerIcon className="w-6 h-6 mr-2" />
              <DatePicker
                value={dates}
                suffixIcon={null}
                variant={"borderless"}
                onChange={handleDateChange}
                format="MM/DD/YYYY"
                placeholder='MM/DD/YYYY'
                className="flex-1 w-full p-2"
              />
            </div> */}
            <div className='flex items-center gap-4'>
              <Tooltip trigger={['click']} title='All Notes Copied'>
                <Button
                  onClick={() => handleCopyAllNotes(caseDocumentsNote)}
                  variant='text'
                  className='bg-[#CECECE87] py-2 px-6 text-sm gap-3 h-11 custom-radius'
                >
                  <CopyIcon /> Copy All
                </Button>
              </Tooltip>
              <Popconfirm
                title='Are you sure to delete all notes?'
                placement='topRight'
                onConfirm={() => handleRemoveAllNote()}
                okText='Delete'
                cancelText='Cancel'
                disabled={isDeletingCase}
              >
                <Button variant='text' className='bg-[#CECECE87] py-2 px-6 text-sm gap-3 h-11 custom-radius'>
                  <DeleteIcon className='fill-black' /> Delete All
                </Button>
              </Popconfirm>
            </div>
          </div>
        )}
      </div>
      {caseDocumentsNote?.length > 0 ? (
        caseDocumentsNote?.map((note: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-4 px-2 border-b border-border-gray">
            <div className="flex items-center gap-4 w-[20%]">
              <Avatar size={40} src={note?.user?.profilePicture} />
              <div className="flex flex-col text-sm">
                <span className="font-medium text-black">{note?.user?.name}</span>
                <span className="text-light-gray text-xs">{moment(note?.createdAt).format('MM/DD/YYYY')}</span>
              </div>
            </div>
            {
              note?.description && <div className="flex items-center gap-2 w-[40%]">
                <span><NoteIcon className="text-2xl text-gray-500" /></span>
                <p className={`text-sm text-black ${showMoreDescription.showMoreDesId === index && showMoreDescription.show ? "max-w-[90%] whitespace-pre-line" : "truncate max-w-[80%]"}`}>
                  {showMoreDescription.showMoreDesId === index && showMoreDescription.show
                    ? note?.description : note?.description.length > 65 ? `${note?.description.slice(0, 65)}...` : note?.description}
                </p>
                {note?.description.length > 65 && (
                  <>
                    {showMoreDescription.showMoreDesId === index && showMoreDescription.show ? (
                      <span className="text-primary text-xs cursor-pointer ml-1"
                        onClick={() => handleViewLess(index)}> Show less </span>
                    ) : (
                      <span
                        className="text-primary text-xs cursor-pointer ml-1"
                        onClick={() => handleViewMore(index)} > View more </span>
                    )}
                  </>
                )}
              </div>}

            <div className="flex gap-2 w-[20%] justify-end">
              <Button variant='text' className='border-0 shadow-none px-0 w-6 h-6 justify-center' onClick={() => showAddNotesModal(note)}>
                <EditIcon />
              </Button>
              <Tooltip trigger={['click']} title='Note Copied'>
                <Button
                  variant='text'
                  className='cursor-pointer'
                  onClick={() => handleCopyNote(`${moment(note?.createdAt).format('MM/DD/YYYY')} - ${note?.description}`)}
                >
                  <CopyIcon className='text-secondary' />
                </Button>
              </Tooltip>
              <div className='flex gap-2'>
                <Popconfirm
                  title='Are you sure to delete?'
                  placement='topRight'
                  onConfirm={() => handleRemoveNote(note?._id)}
                  okText='Yas'
                  cancelText='No'
                  disabled={isDeletingCase}
                >
                  <Button variant='text' className='border-0 shadow-none px-0 w-6'>
                    <DeleteIcon className='text-danger fill-danger' />
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className='text-center text-light-gray font-medium py-5'>Click on Add Notes to add notes.</p>
      )}
      <AddNotesModal
        isLoading={isCreateCaseLoading}
        open={addNotesModal}
        onCancel={handleCancel}
        onOk={handleAddNote}
        handleUpdateNote={handleUpdateNote}
        editModalData={editModalData}
      />
    </section>
  );
}

export default AddNotes;
