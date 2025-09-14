import React from 'react';
import { Divider, Modal } from 'antd';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData?: any;
}

const ReviewerDetailModal: React.FC<UserDetailsModalProps> = ({
    isOpen,
    onClose,
    userData,
}) => {

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
        </Modal>
    );
};


export default ReviewerDetailModal;