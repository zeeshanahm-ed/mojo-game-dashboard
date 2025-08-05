import { useState } from 'react';

import moment from 'moment';
//icons
import DatePickerIcon from 'assets/icons/date-picker-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import FormIcon from 'assets/icons/form-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
import AddIcon from 'assets/icons/add-icon.svg?react';
//components & Hooks
import Button from 'components/core-ui/button/button';
import { CASES_DATA_SUBTYPE, CASES_DATA_TYPE } from 'components/global/global';
import AddDetailAuthModal from 'components/modals/add-details-auth-form';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useCaseDataDelete from '../core/hooks/useCaseDataDelete';
import useCreateCase from '../core/hooks/useCreateCase';
import useDeleteSingleDocument from '../core/hooks/useDeleteSingleDocument';

function DetailsAuthorizationForm({ serviceData, authourizationData, refetchCaseData }: any) {
  const [addNotesModal, setAddNotesModal] = useState(false);
  const [editModalData, setEditModalData] = useState('');
  const { createCaseMutate, isCreateCaseLoading } = useCreateCase();
  const { deleteCaseData } = useCaseDataDelete();
  const { deleteSingleDocument, singleDeleteLoading } = useDeleteSingleDocument();
  const handleCancel = () => {
    setAddNotesModal(false);
  };

  const handleAddNote = (note: any) => {
    const clientServiceData = {
      client: serviceData?.data?.client?._id,
      case: serviceData?.data?._id,
      caseDataType: CASES_DATA_TYPE.AUTHORIZATION_FORM,
      caseDataSubType: CASES_DATA_SUBTYPE.NOTES,
      totalWorkingHours:
        serviceData?.data?.caseType?.name !== 'Individual Job Placement'
          ? parseInt(note?.hoursToWork)
          : undefined,
      workingHours:
        serviceData?.data?.caseType?.name !== 'Individual Job Placement'
          ? parseInt(note?.workingHours || note?.actualHoursWorked)
          : undefined,
      startDate: note?.dateRange ? note?.dateRange[0].toISOString() : null,
      endDate: note?.dateRange ? note?.dateRange[1].toISOString() : null,
      phase: 7,
    };
    const caseData = {
      ...clientServiceData,
      description: note?.notes,
    };
    createCaseMutate(caseData, {
      onSuccess: async () => {
        showSuccessMessage('Authorization form added successfully');
        setEditModalData('');
        refetchCaseData();
        setAddNotesModal(false);
      },
      onError: (error) => {
        showErrorMessage('Error while adding notes!');
        console.error('Failed to get signed URL', error);
      },
    });
  };

  const handleUpdateAuth = (note: any) => {
    const body = {
      startDate: note?.dateRange ? note?.dateRange[0].toISOString() : null,
      endDate: note?.dateRange ? note?.dateRange[1].toISOString() : null,
      workingHours:
        serviceData?.data?.caseType?.name !== 'Individual Job Placement'
          ? parseInt(note?.actualHoursWorked)
          : undefined,
      totalWorkingHours:
        serviceData?.data?.caseType?.name !== 'Individual Job Placement'
          ? parseInt(note?.hoursToWork)
          : undefined,
      description: note?.notes,
    };
    deleteSingleDocument(
      { id: note?.editModalData?._id, body: body },
      {
        onSuccess: () => {
          refetchCaseData();
          handleCancel();
          setEditModalData('');
          showSuccessMessage('Updated Successfully!');
        },
        onError: (error) => {
          console.error('Delete error', error);
          showErrorMessage('Error while updating!');
        },
      }
    );
  };

  const handleRemoveNote = (id: string) => {

    deleteCaseData(id, {
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
  return (
    <div className='mb-14'>
      <div className='flex justify-between items-center pb-8'>
        <div className='flex items-center gap-3 text-lg text-dark-gray font-medium'>
          <FormIcon />
          <h2>Authorization Form</h2>
        </div>
        <Button variant='secondary' className='text-sm gap-3 h-11 custom-radius px-8' onClick={() => setAddNotesModal(true)}>
          <AddIcon /> Add
        </Button>
      </div>
      {authourizationData?.AUTHORIZATION_FORM?.NOTES?.length > 0 ? (
        authourizationData?.AUTHORIZATION_FORM?.NOTES.map((section: any, index: number) => (
          <div key={index} className='flex gap-5 items-center mb-12 justify-between'>
            <div className='flex justify-between w-[20%] items-center'>
              <p className=' text-light-gray text-centerfont-medium'>Start Date</p>
              <div className='border border-[#d9d9d9] h-11 custom-radius py-3 px-5 w-50 gap-2 flex items-center'>
                <DatePickerIcon className='w-6 h-6 mb-1 ' />{section?.startDate ? moment(section?.startDate).format('MM/DD/YYYY') : 'N/A'}
              </div>
            </div>
            <div className='flex justify-between w-[20%] items-center'>
              <p className=' text-light-gray text-center font-medium'>End Date</p>
              <div className='border border-[#d9d9d9] h-11 custom-radius py-3 px-5 gap-2 flex w-50 items-center'>
                <DatePickerIcon className='w-6 h-6 mb-1' />{section?.endDate ? moment(section.endDate).format('MM/DD/YYYY') : 'N/A'}
              </div>
            </div>
            {serviceData?.data?.caseType?.name !== 'Individual Job Placement' && (
              <>
                <div className='w-[20%] flex'>
                  <p className={`text-light-gray font-medium `}>
                    No of Hours to work :
                  </p>
                  <div className='font-normal ml-2'>{section?.totalWorkingHours}</div>
                </div>
              </>
            )
            }
            {serviceData?.data?.caseType?.name !== 'Individual Job Placement' && (
              <>
                <div className='w-[20%] flex'>
                  <p className={`text-light-gray font-medium `}>
                    Actual Hours Worked :
                  </p>
                  <div className='font-normal ml-2'>{section?.workingHours}</div>
                </div>
              </>
            )
            }

            {/* <TextArea style={{ resize: 'none' }} rows={2} value={section?.description} readOnly /> */}
            <div className='flex items-center gap-5'>
              <Button variant='text' onClick={() => {
                setAddNotesModal(true);
                setEditModalData(section)
              }}
                className='h-11 custom-radius'
              >
                <EditIcon />
              </Button>
              <Button className='h-11 custom-radius' variant='text' onClick={() => handleRemoveNote(section._id)}>
                <DeleteIcon />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className='text-center text-light-gray font-medium'>Click on add to add Authorization Form</p>
      )}

      <AddDetailAuthModal
        isLoading={isCreateCaseLoading}
        open={addNotesModal}
        onCancel={() => {
          handleCancel();
          setEditModalData('')
        }}
        onOk={handleAddNote}
        handleUpdate={handleUpdateAuth}
        serviceData={serviceData}
        editModalData={editModalData}
        singleDeleteLoading={singleDeleteLoading}
      />
    </div>
  );
}

export default DetailsAuthorizationForm;
