import React, { useState } from 'react';
import { Button, Divider, Empty, Modal, Popconfirm, Radio } from 'antd';
//icons
import { IoGameControllerOutline } from "react-icons/io5";
import UserIcon from 'assets/icons/user-icon.svg?react';
import GameImage from 'assets/images/game-image.png';
import { RxCounterClockwiseClock } from "react-icons/rx";



interface Game {
  id: string;
  name: string;
  categories: string;
}

interface UserData {
  userId: string;
  fullName: string;
  age: number;
  sex: string;
  phoneNumber: string;
  emailAddress: string;
  walletBalance: number;
  status: 'Active' | 'Suspended';
  registeredDate: string;
  gamesPlayed: Game[];
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: UserData;
}

const staticUserData: UserData = {
  userId: '031556',
  fullName: 'Dawayen Johnson',
  age: 25,
  sex: 'Male',
  phoneNumber: '09019184118978',
  emailAddress: 'dawayejohn@gmail.com',
  walletBalance: 450,
  status: 'Active',
  registeredDate: '12/02/2025',
  gamesPlayed: [
    {
      id: '12',
      name: 'Game 12',
      categories: 'Cinema, Wrestling, E-Gaming, Boxing'
    },
    {
      id: '13',
      name: 'Game 13',
      categories: 'Cinema, Wrestling, E-Gaming, Boxing'
    },
    {
      id: '14',
      name: 'Game 14',
      categories: 'Cinema, Wrestling, E-Gaming, Boxing'
    }
  ]
};

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  userData = staticUserData
}) => {
  const [status, setStatus] = useState<'Active' | 'Suspended'>(userData.status);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusChange = (newStatus: 'Active' | 'Suspended') => {
    setStatus(newStatus);
  };

  const handleDeleteUser = async () => {
    console.log('User deleted:', userData.userId);
    onClose();
  };

  const handleSaveChanges = async () => {
    console.log('Changes saved:', { userId: userData.userId, status });
    onClose();
  };

  if (!isOpen) return null;


  const UserDetailContainerClass = "flex gap-5 items-center";
  const UserDetailHeadingClass = "text-base text-medium-gray";
  const UserDetailSubTextClass = "text-base font-medium ";


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
            Registered: <span className='text-black'>{userData.registeredDate}</span>
          </span>
        </div>
      </div>
      <Divider />

      {/* Details */}
      <div className="space-y-8">
        {/* Row 2 */}
        <div className="flex justify-between flex-wrap">
          <div className={UserDetailContainerClass}>
            <label className={UserDetailHeadingClass}>User ID :</label>
            <p className={UserDetailSubTextClass}>{userData.userId}</p>
          </div>
          <div className={UserDetailContainerClass}>
            <label className={UserDetailHeadingClass}>Full Name :</label>
            <p className={UserDetailSubTextClass}>{userData.fullName}</p>
          </div>
          <div className={UserDetailContainerClass}>
            <label className={UserDetailHeadingClass}>Age :</label>
            <p className={UserDetailSubTextClass}>{userData.age}</p>
          </div>
          <div className={UserDetailContainerClass}>
            <label className={UserDetailHeadingClass}>Sex :</label>
            <p className={UserDetailSubTextClass}>{userData.sex}</p>
          </div>
        </div>
        {/* Row 2 */}
        <div className="flex justify-between flex-wrap">
          <div className='flex gap-2  items-center'>
            <label className={UserDetailHeadingClass}>Phone Number :</label>
            <p className={UserDetailSubTextClass}>{userData.phoneNumber}</p>
          </div>
          <div className='flex gap-2  items-center'>
            <label className={UserDetailHeadingClass}>Email Address :</label>
            <p className={UserDetailSubTextClass}>{userData.emailAddress}</p>
          </div>
          <div className='flex gap-2 items-center'>
            <label className={UserDetailHeadingClass}>Wallet Balance :</label>
            <p className={UserDetailSubTextClass}>${userData.walletBalance}</p>
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
        {userData.gamesPlayed.length ? (
          <div className="space-y-3 overflow-y-auto max-h-44">
            {userData.gamesPlayed.map((game) => (
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
          onConfirm={() => handleDeleteUser()}
          okText="Yes"
          cancelText="No"
        >
          <Button danger className='bg-danger text-white py-5' loading={isDeleting}>Delete User</Button>
        </Popconfirm>
        <Button
          type="primary"
          className='py-5'
          onClick={handleSaveChanges}
          loading={isSaving}
        >
          Save changes
        </Button>
      </div>
    </Modal>
  );
};


export default UserDetailsModal;