import React, { useEffect, useState } from 'react';
import { Button, Divider, Empty, Modal, Popconfirm, Radio, Spin } from 'antd';
import dayjs from 'dayjs';
//icons
import { IoGameControllerOutline } from "react-icons/io5";
import UserIcon from 'assets/icons/user-icon.svg?react';
import GameImage from 'assets/images/game-image.png';
import { RxCounterClockwiseClock } from "react-icons/rx";
//hooks & utils
import useGetSingleUserData from '../core/hooks/useGetSingleUserData';
import useChangeUserStatus from '../core/hooks/useChangeUserStatus';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import useDeleteSingleUser from 'pages/rolesNPermissions/core/hooks/useDeleteSingleUser';

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
        showSuccessMessage('User status changed successfully!');
        onClose();
        refetchAllUserData();
      },
      onError: () => {
        showErrorMessage('An error occurred while changing the user status.');
      },

    });
  };

  const handleDeleteClick = () => {
    deleteSingleUser({ userId: userData?._id }, {
      onSuccess: () => {
        showSuccessMessage('User deleted successfully!');
        refetchAllUserData();
        onClose();
      },
      onError: () => {
        showErrorMessage('An error occurred while deleting the user.');
      },

    });
  };

  const handleSaveChanges = async () => {
    handleChangeStatus();
  };

  if (!isOpen) return null;


  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      closeIcon={true}
    >
      {/* Header */}
      <div className="flex items-center justify-between pe-10">
        <div className="flex items-center gap-3">
          <UserIcon className="w-5 h-5 " />
          <h2 className="text-xl">User Details</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-base text-medium-gray">
            Registered: <span className='text-black'>{dayjs(userData?.createdAt).format('DD/MM/YYYY')}</span>
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
          <div className="space-y-8">
            {/* Row 2 */}
            <div className="flex gap-5">
              <div className="flex w-[30%] gap-2 items-center">
                <label className="text-base text-medium-gray text-nowrap">User ID :</label>
                <p className="text-base font-medium  truncate max-w-[95%]">{userData?._id}</p>
              </div>
              <div className="flex w-[40%] gap-2 items-center">
                <label className="text-base text-medium-gray text-nowrap">Full Name :</label>
                <p className="text-base font-medium  truncate max-w-[95%]">{userData?.firstName} {userData?.lastName}</p>
              </div>
              <div className="flex w-36 gap-2 items-center">
                <label className="text-base text-medium-gray">Age :</label>
                <p className="text-base font-medium ">{userData?.age}</p>
              </div>
              <div className={"flex w-36 gap-2 items-center"}>
                <label className="text-base text-medium-gray">Sex :</label>
                <p className="text-base font-medium ">{userData?.gender}</p>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex gap-5">
              <div className='flex w-[30%] gap-2 items-center'>
                <label className="text-base text-medium-gray text-nowrap">Phone Number :</label>
                <p className="text-base font-medium  truncate max-w-[95%]">{userData?.phoneNumber}</p>
              </div>
              <div className='flex flex-1 gap-2  items-center'>
                <label className="text-base text-medium-gray text-nowrap">Email Address :</label>
                <p className="text-base font-medium  truncate max-w-[95%]">{userData?.email}</p>
              </div>
              <div className='flex flex-1 gap-2 items-center'>
                <label className="text-base text-medium-gray text-nowrap ">Wallet Balance :</label>
                <p className="text-base font-medium">${userData?.creditsBalance}</p>
              </div>
            </div>

            {/* Row 3 */}
            <div className='flex items-baseline gap-6'>
              <label className="text-base text-medium-gray block">Status :</label>
              <div className="flex items-center gap-6 flex-wrap">
                <Radio.Group
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="flex items-center gap-2"
                >
                  <Radio className='text-base' value="Active">Active</Radio>
                  <Radio className='text-base' value="Suspended">Suspended</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>

          <Divider />

          {/* Games Played Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <IoGameControllerOutline className="w-6 h-6" />
              <h3 className="text-xl ">Games Played</h3>
            </div>
            {userData?.gamesPlayed.length ? (
              <div className="space-y-3 overflow-y-auto max-h-44">
                {userData?.gamesPlayed.map((game: any) => (
                  <div
                    key={game.id}
                    className="flex text-base items-center gap-4 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <img src={GameImage} alt='Game Image' />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span >{game.name}</span>
                        <span className="text-medium-gray">|</span>
                        <span>{game.categories}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="No Games Played" />
            )}
          </div>
          <Divider />
          {/* History Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <RxCounterClockwiseClock className="w-6 h-6" />
              <h3 className="text-xl">History</h3>
            </div>
            <div className="flex items-center justify-center py-12 text-medium-gray">
              <Empty description="No History Found"></Empty>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-8">

            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDeleteClick()}
              okText="Yes"
              cancelText="No"
            >
              <Button danger className='bg-danger text-white py-5'>Delete User</Button>
            </Popconfirm>
            <Button
              type="primary"
              className='py-5'
              onClick={handleSaveChanges}
              disabled={status === userData?.status}
            >
              Save changes
            </Button>
          </div>
        </>
      }
    </Modal>
  );
};


export default UserDetailsModal;