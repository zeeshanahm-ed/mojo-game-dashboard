import React from 'react';
import { Button, Divider, Modal, Popconfirm } from 'antd';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useDeleteSingleUser from 'pages/rolesNPermissions/core/hooks/useDeleteSingleUser';
import useChangeUserStatus from 'pages/user-management/core/hooks/useChangeUserStatus';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import { getUser } from 'auth';
import { hasPermission } from 'helpers/CustomHelpers';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData?: any;
    refetchReviewerData: () => void;
}

const ReviewerDetailModal: React.FC<UserDetailsModalProps> = ({
    isOpen,
    onClose,
    userData,
    refetchReviewerData,
}) => {
    const CURRENT_USER = getUser();
    const { deleteSingleUser, isLoading: isDeletingUser } = useDeleteSingleUser();
    const { changeStatusMutate, isLoading: isChangingStatus } = useChangeUserStatus();


    const handleDeleteClick = () => {
        deleteSingleUser({ userId: userData?._id }, {
            onSuccess: () => {
                showSuccessMessage('User deleted successfully!');
                refetchReviewerData();
                onClose();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },

        });
    };

    const handleActiveNInactive = (status: 'Active' | 'Suspended') => {
        const payload = {
            status: status,
            userId: userData?._id
        }
        changeStatusMutate(payload, {
            onSuccess: () => {
                showSuccessMessage('User status changed successfully!');
                onClose();
                refetchReviewerData();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },

        });
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
            centered
            closeIcon={true}
            title={<p className='font-normal text-2xl'>Reviewer Profile</p>}
            maskClosable={false}
        >
            {isDeletingUser || isChangingStatus ? <FallbackLoader isModal={true} /> : null}
            <Divider />
            {/* Details */}
            <div className="space-y-8">
                {/* Row 2 */}
                <div className="flex gap-5 items-center flex-wrap">
                    <div className="flex gap-2 items-center">
                        <label className="text-base text-medium-gray text-nowrap">User ID :</label>
                        <p className="text-base font-medium  truncate max-w-[95%]">{userData?._id}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-base text-medium-gray text-nowrap">Full Name :</label>
                        <p className="text-base font-medium  truncate max-w-[95%]">{userData?.firstName} {userData?.lastName}</p>
                    </div>
                    <div className='flex gap-2  items-center'>
                        <label className="text-base text-medium-gray text-nowrap">Email Address :</label>
                        <p className="text-base font-medium  truncate max-w-[95%]">{userData?.email}</p>
                    </div>
                    <div className={"flex gap-2 items-center"}>
                        <label className="text-base text-medium-gray">Status :</label>
                        <p className="text-base font-medium ">{userData?.status}</p>
                    </div>
                    <div className={"flex gap-2 items-center"}>
                        <label className="text-base text-medium-gray">Questions Reviewed :</label>
                        <p className="text-base font-medium ">{10}</p>
                    </div>
                </div>
            </div>
            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 mt-8">

                <Popconfirm
                    title="Are you sure to delete this user?"
                    onConfirm={() => handleDeleteClick()}
                    okText="Yes"
                    cancelText="No"
                    disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                >
                    <Button disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                        className='bg-danger text-white py-5'>Delete User</Button>
                </Popconfirm>
                <Button
                    type="primary"
                    className='py-5'
                    disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                    onClick={() => handleActiveNInactive(userData?.status === 'Active' ? 'Suspended' : 'Active')}
                >
                    {userData?.status === 'Active' ? 'Suspend' : 'Active'}
                </Button>
            </div>
        </Modal>
    );
};


export default ReviewerDetailModal;