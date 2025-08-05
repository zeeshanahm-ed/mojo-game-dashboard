/* eslint-disable react/no-array-index-key */
import { useState } from 'react';

import { Popconfirm, Tooltip } from 'antd';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import moment from 'moment';

import Button from 'components/core-ui/button/button';
import { handleErrorMineImg } from 'components/global/global';
import AddNotesModal from 'components/modals/add-notes-modal';

import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';

import NoteIcon from 'assets/icons/notes-icon-black.svg?react';
import AddIcon from 'assets/icons/add-icon.svg?react';
import CopyIcon from 'assets/icons/copy-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-white-icon.svg?react';
import User from 'assets/images/user.png';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';

import useBillingCaseDelete from '../core/hooks/useBillingCaseDelete';
import useCreateCase from '../core/hooks/useCreateCase';
import useDeleteSingleBillingDocument from '../core/hooks/useDeleteSingleDocument copy';
import useBillingAllNotesDelete from '../core/hooks/useBillingAllNotesDelete';

function BillingNotes({
  serviceData,
  caseDataType,
  caseDataSubType,
  refetchCaseData,
  caseDocumentsNote,
  currentUser,
}: any) {

  const [addNotesModal, setAddNotesModal] = useState(false);
  const [editModalData, setEditModalData] = useState('');
  const { deleteBillingData, isDeletingBilling } = useBillingCaseDelete();
  const { deleteBillingAllNotes } = useBillingAllNotesDelete();
  const { createBillingMutate, isBillingLoading } = useCreateCase();
  const [showMoreDescription, setShowMoreDescription] = useState<{ showMoreDesId: string | number; show: boolean; less: boolean }>({
    showMoreDesId: "",
    show: false,
    less: false
  });
  const { deleteSingleDocument } = useDeleteSingleBillingDocument();


  const showAddNotesModal = (data: any) => {
    setAddNotesModal(true);
    setEditModalData(data);
  };
  const handleCancel = () => {
    setAddNotesModal(false);
    setEditModalData('');
  };

  const handleAddNote = (note: string, selectedDate: any) => {
    if (note) {
      const clientServiceData = {
        client: serviceData?.data?.client?._id,
        case: serviceData?.data?._id,
        addedBy: currentUser?._id,
        type: caseDataType,
        subType: caseDataSubType,
      };
      const caseData = {
        ...clientServiceData,
        description: note,
        createdAt: selectedDate
      };
      createBillingMutate(caseData, {
        onSuccess: async () => {
          showSuccessMessage('Notes added successfully');
          refetchCaseData();
          handleCancel();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const { response } = error;
            const errorMessage = response?.data?.message || 'An error occurred while making invoice';
            showErrorMessage(errorMessage);
          } else {
            showErrorMessage('Error while adding notes!');
            console.error('Failed to get signed URL', error);
          }
          handleCancel()

        },
      });
    }
  };


  const handleUpdateNote = (data: any) => {
    if (data) {
      const caseData = { ...data };
      deleteSingleDocument(
        { id: data._id || '', body: caseData },
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
    deleteBillingData(id, {
      onSuccess: () => {
        refetchCaseData();
        showSuccessMessage('Deleted Successfully!');
      },
      onError: (error) => {
        console.error('Delete error', error);
        showErrorMessage('Error while deleting!');
      },
    });
  };

  const handleRemoveAllNote = () => {
    const payload = {
      ids: caseDocumentsNote?.map((v: any) => v._id) || [],
    };
    deleteBillingAllNotes(payload, {
      onSuccess: () => {
        refetchCaseData();
        showSuccessMessage('Deleted Successfully!');
      },
      onError: (error) => {
        console.error('Delete error', error);
        showErrorMessage('Error while deleting!');
      },
    });
  };

  const handleCopyNote = (note: string) => {
    copy(note);
    setTimeout(() => 2000);
  };


  const handleCopyAllNotes = (caseDocumentsNote: any) => {
    const allNotes = caseDocumentsNote
      .map((note: any) => {
        return `${note.description}`;
      })
      .join('\n');

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
      <div className='flex items-center justify-between gap-5 mb-5'>
        <Button variant='secondary' className='text-sm gap-3 h-11 custom-radius px-8' onClick={() => showAddNotesModal("")}>
          <AddIcon /> Add Note
        </Button>

        {caseDocumentsNote?.length > 0 && (
          <>
            {/* <div className="flex items-center border h-11 custom-radius px-2 ml-auto justify-self-end">
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
                  className='bg-[#CECECE87] h-11 custom-radius px-6 text-sm gap-3'
                >
                  <CopyIcon /> Copy All
                </Button>
              </Tooltip>
              <Button
                onClick={() => handleRemoveAllNote()}
                variant='text'
                className='bg-[#CECECE87] h-11 custom-radius px-6 text-sm gap-3'
              >
                <DeleteIcon className='fill-black' /> Delete All
              </Button>
            </div>
          </>
        )}
      </div>
      {caseDocumentsNote?.length > 0 ? (
        caseDocumentsNote?.map((note: any, index: number) => (
          <div key={index + 'notes'} className='flex items-center py-4 justify-between gap-5 border-b border-border-gray'>
            <div className="flex items-center gap-4 w-[20%]">
              <div className='flex flex-col gap-y-2 items-center'>
                <img
                  className='h-12 w-12 rounded-full object-cover'
                  src={note?.user?.profilePicture || User}
                  alt='user'
                  onError={handleErrorMineImg}
                />
              </div>
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
            <div className='flex flex-centered gap-3'>
              <Button variant='text' className='border-0 shadow-none px-0 w-6 h-6 justify-center' onClick={() => showAddNotesModal(note)}>
                <EditIcon />
              </Button>
              <Tooltip trigger={['click']} title='Note Copied'>
                <Button
                  variant='text'
                  className='cursor-pointer'
                  onClick={() => handleCopyNote(note?.description)}
                >
                  <CopyIcon className='text-secondary' />
                </Button>
              </Tooltip>
              <Popconfirm
                title='Are you sure to delete?'
                placement='topRight'
                onConfirm={() => handleRemoveNote(note?._id)}
                okText='Yes'
                cancelText='No'
                disabled={isDeletingBilling}
              >
                <Button variant='text' className='cursor-pointer'>
                  <DeleteIcon className='fill-danger text-danger' />
                </Button>
              </Popconfirm>
            </div>
          </div>
        ))
      ) : (
        <p className='text-center text-light-gray font-medium py-8'>Click on Add Notes to add notes.</p>
      )}
      <AddNotesModal
        isLoading={isBillingLoading}
        open={addNotesModal}
        onCancel={handleCancel}
        onOk={handleAddNote}
        editModalData={editModalData}
        handleUpdateNote={handleUpdateNote}
      />
    </section>
  );
}

export default BillingNotes;
