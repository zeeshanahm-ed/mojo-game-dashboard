import React, { useEffect, useState } from 'react';
import { Button, Divider, Empty, Modal, Popconfirm, Radio, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
//icons
import { IoGameControllerOutline } from "react-icons/io5";
import UserIcon from 'assets/icons/user-icon.svg?react';
import GameImage from 'assets/images/game-image.png';
//hooks & utils
import useGetSingleUserData from '../core/hooks/useGetSingleUserData';
import useChangeUserStatus from '../core/hooks/useChangeUserStatus';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import useDeleteSingleUser from 'pages/rolesNPermissions/core/hooks/useDeleteSingleUser';
import { hasPermission } from 'helpers/CustomHelpers';
import { getUser } from 'auth';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchAllUserData: () => void;
  modalData?: any;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  modalData,
  refetchAllUserData
}) => {
  const { t } = useTranslation();
  const direction = useDirection();
  const CURRENT_USER = getUser();
  const { userData, isLoading } = useGetSingleUserData(modalData?._id);
  const [status, setStatus] = useState<'Active' | 'Suspended'>();
  const { changeStatusMutate, isLoading: isChangingStatus } = useChangeUserStatus();
  const { deleteSingleUser, isLoading: isDeletingUser } = useDeleteSingleUser();

  useEffect(() => {
    if (userData) {
      setStatus(userData?.status)
    }

  }, [userData])

  const handleStatusChange = (newStatus: 'Active' | 'Suspended') => {
    setStatus(newStatus);
  };


  const handleChangeStatus = () => {
    const payload = {
      status: status,
      userId: userData?._id
    }
    changeStatusMutate(payload, {
      onSuccess: () => {
        showSuccessMessage(t('User status changed successfully'));
        onClose();
        refetchAllUserData();
      },
      onError: (error: any) => {
        showErrorMessage(error?.response?.data?.message);
        console.error('Error:', error);
      },

    });
  };

  const handleDeleteClick = () => {
    deleteSingleUser({ userId: userData?._id }, {
      onSuccess: () => {
        showSuccessMessage(t('User deleted successfully'));
        refetchAllUserData();
        onClose();
      },
      onError: (error: any) => {
        showErrorMessage(error?.response?.data?.message);
        console.error('Error:', error);
      },

    });
  };

  const handleSaveChanges = async () => {
    handleChangeStatus();
  };

  if (!isOpen) return null;

  const handleCloseModal = () => {
    onClose();
    setStatus(undefined);
  };


  return (
    <Modal
      open={isOpen}
      onCancel={handleCloseModal}
      footer={null}
      width={900}
      centered
      closeIcon={true}
      className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pe-10">
        <div className="flex items-center gap-3">
          <UserIcon className="w-5 h-5 " />
          <h2 className="text-xl">{t('User Details')}</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-base text-medium-gray">
            {t('Registered')} : <span className='text-black me-2'>{dayjs(userData?.createdAt).format('DD/MM/YYYY')}</span>
          </span>
        </div>
      </div>
      {isChangingStatus || isDeletingUser ? <FallbackLoader isModal={true} /> : null}

      <Divider />
      {isLoading ?
        <div className='flex justify-center items-center h-32'>
          <Spin size="large" />
        </div>
        :
        <>

          {/* Details */}
          <div className="space-y-8" dir={direction}>
            {/* Row 2 */}
            <div className="flex gap-5">
              <div className="flex w-[30%] gap-2 items-center">
                <label className="text-base text-medium-gray text-nowrap">{t('User ID')}:</label>
                <p className="text-base font-medium  truncate max-w-[95%]">{userData?._id}</p>
              </div>
              <div className="flex w-[40%] gap-2 items-center">
                <label className="text-base text-medium-gray text-nowrap">{t('Full Name')}:</label>
                <p className="text-base font-medium  truncate max-w-[95%]">{userData?.firstName} {userData?.lastName}</p>
              </div>
              <div className="flex w-36 gap-2 items-center">
                <label className="text-base text-medium-gray">{t('Age')}:</label>
                <p className="text-base font-medium ">{userData?.age}</p>
              </div>
              <div className={"flex w-36 gap-2 items-center"}>
                <label className="text-base text-medium-gray">{t('Sex')}:</label>
                <p className="text-base font-medium ">{t(userData?.gender)}</p>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex gap-5">
              <div className='flex w-[30%] gap-2 items-center'>
                <label className="text-base text-medium-gray text-nowrap">{t('Phone Number')}:</label>
                <p className="text-base font-medium  truncate max-w-[95%]">{userData?.phoneNumber}</p>
              </div>
              <div className='flex flex-1 gap-2  items-center'>
                <label className="text-base text-medium-gray text-nowrap">{t('Email Address')}:</label>
                <p className="text-base font-medium  truncate max-w-[95%]">{userData?.email}</p>
              </div>
              <div className='flex flex-1 gap-2 items-center'>
                <label className="text-base text-medium-gray text-nowrap ">{t('Credits Balance')}:</label>
                <p className="text-base font-medium">{userData?.creditsBalance}</p>
              </div>
            </div>

            {/* Row 3 */}
            <div className='flex items-baseline gap-6'>
              <label className="text-base text-medium-gray block">{t('Status')}:</label>
              <div className="flex items-center gap-6 flex-wrap">
                <Radio.Group
                  disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="flex items-center gap-2"
                >
                  <Radio className={`text-base `} value="Active">{t('Active')}</Radio>
                  <Radio className={`text-base `} value="Suspended">{t('Suspended')}</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>

          <Divider />

          {/* Games Played Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <IoGameControllerOutline className="w-6 h-6" />
              <h3 className="text-xl ">{t('Games Created')}</h3>
            </div>
            {userData?.gamesPlayed.length ? (
              <div className="space-y-3 overflow-y-auto max-h-64">
                {userData?.gamesPlayed.map((game: any) => (
                  <div
                    key={game?.gameId}
                    className="flex text-base items-center gap-4 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <img src={GameImage} alt='Game Image' />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <Tooltip title={game?.gameName}>
                          <span className='truncate w-44'>{game?.gameName}</span>
                        </Tooltip>
                        <Divider type="vertical" className='h-10' />
                        <span>{game?.categories?.map((cat: any) => cat.name[direction === "rtl" ? "ar" : "en"] || cat.name["en"]).join(", ") || ""}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description={t('No Games Played')} className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`} />
            )}
          </div>
          {/* History Section */}
          {/* <Divider />
          <div>
            <div className="flex items-center gap-3 mb-4">
              <RxCounterClockwiseClock className="w-6 h-6" />
              <h3 className="text-xl">History</h3>
            </div>
            <div className="flex items-center justify-center py-12 text-medium-gray">
              <Empty description="No History Found"></Empty>
            </div>
          </div> */}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-8">

            <Popconfirm
              title={t('Are you sure to delete this user?')}
              onConfirm={() => handleDeleteClick()}
              okText={t('Yes')}
              cancelText={t('No')}
              disabled={hasPermission(CURRENT_USER?.role, "read_only")}
            >
              <Button
                variant='text'
                disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                className={`bg-danger text-white py-5 `}>{t('Delete User')}</Button>
            </Popconfirm>
            <Button
              type="primary"
              className={`py-5 `}
              onClick={handleSaveChanges}
              disabled={status === userData?.status}
            >
              {t('Save changes')}
            </Button>
          </div>
        </>
      }
    </Modal>
  );
};


export default UserDetailsModal;