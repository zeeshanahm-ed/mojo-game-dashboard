import { SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
//components
import { Empty, Pagination, Popconfirm, Select, Spin, Switch } from 'antd';
import { ISignUpForm } from 'auth';
import Button from 'components/core-ui/button/button';

//icons
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import AddIcon from 'assets/icons/rounded-add-icon.svg?react';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
//helpers & hooks & utilities
import * as authHelper from '../../auth/core/auth-helpers';
import useSignUp from 'auth/core/hooks/use-sign-up';
import { useHeaderProps } from 'components/core/use-header-props';
import { User, UserDataParams } from './core/_modals';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import UserManagementAddModal from './components/user-management-add-modal';
import useUpdateData from './core/hooks/useUpdateData';
import useUserData from './core/hooks/useUserData';

const TABLE_HEAD = ['User ID', 'User', 'User Role', 'Email', 'Password', 'User Status', 'Actions'];

const ROLES_OPTIONS = [
  { value: 'admin', label: 'Super Admin' },
  { value: 'operations', label: 'Team Member' },
  { value: 'billing', label: 'Billing' },
]

function UserManagement() {
  const currentUser = authHelper.getUser();
  const intitialParams: UserDataParams = {
    limit: 10,
    page: 1,
    search: '',
    role: '',
  };
  const [listing, setListing] = useState({ ...intitialParams });
  const { userData, refetch, isLoading: isLoadingUserData } = useUserData(listing);

  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userLoadingId, setUserLoadingId] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>();
  const { setTitle } = useHeaderProps();
  const { mutate } = useSignUp();
  const { mutate: updateUser, isLoading } = useUpdateData(refetch);
  const disabled = true;

  useEffect(() => {
    setTitle('User Management');
  }, [setTitle]);

  const showModal = (user: SetStateAction<undefined> | User) => {
    setSelectedUser(user);
    setIsAddModalOpen(true);
  };

  const handleOk = (values: ISignUpForm) => {
    mutate(values, {
      onSuccess: () => {
        showSuccessMessage('User added succesfully');
        setIsAddModalOpen(false);
        refetch();
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const { response } = error;
          const errorMessage = response?.data?.message || 'An error occurred while adding the client';
          showErrorMessage(errorMessage);
        } else {
          showErrorMessage('An unexpected error occurred');
        }
      },
    });
  };
  const deleteUser = async (uId: any) => {
    const body = {
      isDeleted: true,
    };
    try {
      await updateUser({ id: uId, data: body });
      showSuccessMessage('User Deleted Successfully!');
      setIsAddModalOpen(false);
      refetch();
    } catch (error) {
      showErrorMessage('Failed to delete user');
    }
  };
  const toggleUserActive = (userId: string, isActive: boolean) => {
    setUserLoadingId(userId)
    const body = { isActive: isActive }
    // updateUserActiveStatus(userId, isActive);
    updateUser(
      { id: userId, data: body },
      {
        onSuccess: () => {
          refetch();
          showSuccessMessage('User successfully updated');
          // setIsAddModalOpen(false);
        },
        onError: (error) => {
          console.error('Error while updating', error);
          showErrorMessage('Error while updating!');
        },
      }
    );
  };
  const handleUpdateButton = (values: any) => {
    const body = { role: values?.role, };
    try {
      updateUser(
        { id: values.id, data: body },
        {
          onSuccess: () => {
            refetch();
            showSuccessMessage('User successfully updated');
            setIsAddModalOpen(false);
          },
          onError: (error) => {
            console.error('Error while updating', error);
            showErrorMessage('Error while updating!');
          },
        }
      );
    } catch (error) {
      showErrorMessage('Failed to update user');
    }
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setSelectedUser('');
  };

  const handleRoleChange = (value: string) => {
    setListing({ ...listing, page: 1, role: value });
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  const handlePageChange = (page: number) => {
    setListing({ ...listing, page: page });
  };

  return (
    <section className='overflow-hidden mb-10'>
      <div className='flex items-center justify-between'>
        <div>
          <Button
            variant='secondary'
            className='h-11 custom-radius px-10 gap-3'
            onClick={() => setIsAddModalOpen(true)}
          >
            <AddIcon /> Add User
          </Button>
        </div>
        <Select
          allowClear
          placeholder='All Roles'
          className='w-40 h-11 custom-radius'
          onChange={handleRoleChange}
          options={ROLES_OPTIONS}
        />
      </div>

      <div className='pt-10 w-full overflow-x-scroll'>
        <div className='min-w-[1100px] mb-5'>
          <div className='py-1 grid grid-cols-7 gap-3 border rounded-md border-secondary'>
            {TABLE_HEAD.map((head, index) => (
              <div
                key={head}
                className={`px-4 py-1 my-3 ${index !== TABLE_HEAD.length - 1 ? 'border-r border-r-gray-400' : ''} text-center text-light-gray font-medium text-sm`}
              >
                {head}
              </div>
            ))}
          </div>

          {isLoadingUserData || isLoading ? (
            <div className='flex justify-center items-center h-32'>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {userData?.data?.length > 0 ? (
                userData?.data?.map((user: User) => {
                  const isPasswordVisible = visiblePasswords[user._id];
                  const isCurrentUser = currentUser?._id === user._id;
                  const userRoleLabel: string = ({
                    admin: 'Super Admin',
                    operations: 'Team Member',
                  } as Record<string, string>)[user.role as string] || user.role || '-';

                  return (
                    <div key={user._id} className="py- grid grid-cols-7 gap-3 border-b border-border-gray text-center items-center font-medium text-sm">
                      <div className="px-4 py-4 break-words">{user.userId || '-'}</div>
                      <div className="px-4 py-4 break-words">{user.name}</div>
                      <div className="px-4 py-4 break-words capitalize">{userRoleLabel}</div>
                      <div className="px-4 py-4 break-words">{user.email || '-'}</div>

                      <div className="px-4 py-4 break-words">
                        {isPasswordVisible ? user.password : '*****'}
                        <span className="mx-3 cursor-pointer" onClick={() => togglePasswordVisibility(user._id)}>
                          {isPasswordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </span>
                      </div>

                      <div className="px-4 py-4 break-words">
                        <Switch
                          checked={user.isActive}
                          onChange={(checked) => toggleUserActive(user._id, checked)}
                          checkedChildren=""
                          unCheckedChildren=""
                          loading={isLoading && userLoadingId === user._id}
                        />
                      </div>

                      <div className="flex items-center gap-4 justify-center">
                        <Button onClick={() => showModal(user)} variant="text">
                          <EditIcon />
                        </Button>

                        {!isCurrentUser && (
                          <Popconfirm
                            title="Are you sure you want to delete this user?"
                            onConfirm={() => deleteUser(user._id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button onClick={(e) => e.stopPropagation()} variant="text" className="rounded-md px-4 py-3" >
                              <DeleteIcon />
                            </Button>
                          </Popconfirm>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <Empty className="my-12" description="No Users Found" />
              )}
            </>
          )}

        </div>
      </div>
      {userData?.data?.length !== 0 && (
        <Pagination
          style={{ color: 'white' }}
          className='flex justify-center text-white mt-5'
          current={userData?.currentPage}
          total={userData?.totalItems}
          pageSize={userData?.pageSize}
          onChange={handlePageChange}
        />
      )}
      <UserManagementAddModal
        open={isAddModalOpen}
        onCancel={handleCancel}
        title='Delete'
        name='Andy Elliot'
        selectedUser={selectedUser}
        disabled={disabled}
        handleOkButton={handleOk}
        handleUpdateButton={handleUpdateButton}
      />
    </section>
  );
}

export default UserManagement;
