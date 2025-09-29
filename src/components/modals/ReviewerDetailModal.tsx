import React from 'react';
import { Button, Divider, Modal, Popconfirm } from 'antd';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useDeleteSingleUser from 'pages/rolesNPermissions/core/hooks/useDeleteSingleUser';
import useChangeUserStatus from 'pages/user-management/core/hooks/useChangeUserStatus';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import { getUser } from 'auth';
import { hasPermission } from 'helpers/CustomHelpers';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';

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
    const { t } = useTranslation();
    const direction = useDirection();
    const { deleteSingleUser, isLoading: isDeletingUser } = useDeleteSingleUser();
    const { changeStatusMutate, isLoading: isChangingStatus } = useChangeUserStatus();


    const handleDeleteClick = () => {
        deleteSingleUser({ userId: userData?._id }, {
            onSuccess: () => {
                showSuccessMessage(t('User deleted successfully'));
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
                showSuccessMessage(t('User status changed successfully'));
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
            className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
            title={<p className='font-normal text-2xl'>{t("Reviewer Profile")}</p>}
            maskClosable={false}
        >
            {isDeletingUser || isChangingStatus ? <FallbackLoader isModal={true} /> : null}
            <Divider />
            {/* Details */}
            <div dir={direction} className={`space-y-8`}>
                {/* Row 2 */}
                <div className="flex gap-5 items-center flex-wrap">
                    <div className="flex gap-2 items-center">
                        <label className="text-base text-medium-gray text-nowrap">{t("User ID")} :</label>
                        <p className="text-base font-medium  truncate max-w-[95%]">{userData?._id}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-base text-medium-gray text-nowrap">{t("Full Name")} :</label>
                        <p className="text-base font-medium  truncate max-w-[95%]">{userData?.firstName} {userData?.lastName}</p>
                    </div>
                    <div className='flex gap-2  items-center'>
                        <label className="text-base text-medium-gray text-nowrap">{t("Email Address")} :</label>
                        <p className="text-base font-medium  truncate max-w-[95%]">{userData?.email}</p>
                    </div>
                    <div className={"flex gap-2 items-center"}>
                        <label className="text-base text-medium-gray">{t("Status")} :</label>
                        <p className="text-base font-medium ">{t(userData?.status)}</p>
                    </div>
                    <div className={"flex gap-2 items-center"}>
                        <label className="text-base text-medium-gray">{t("Questions Reviewed")} :</label>
                        <p className="text-base font-medium ">{userData?.totalReviews || "0"}</p>
                    </div>
                </div>
            </div>
            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 mt-8">

                <Popconfirm
                    title={t("Are you sure to delete this user?")}
                    onConfirm={() => handleDeleteClick()}
                    okText={t("Yes")}
                    cancelText={t("No")}
                    disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                >
                    <Button
                        disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                        className={`bg-danger text-white py-5 `}>{t("Delete User")}</Button>
                </Popconfirm>
                <Button
                    type="primary"
                    className={`py-5 `}
                    disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                    onClick={() => handleActiveNInactive(userData?.status === 'Active' ? 'Suspended' : 'Active')}
                >
                    {userData?.status === 'Active' ? t("Suspended") : t("Active")}
                </Button>
            </div>
        </Modal>
    );
};


export default ReviewerDetailModal;