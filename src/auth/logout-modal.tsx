
import React from 'react';
import { Modal, Button, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


interface PromoModalProps {
    open: boolean;
    onClose: () => void;
}


const LogoutModal: React.FC<PromoModalProps> = ({ open, onClose, }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout');
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={<p className='font-normal text-center text-2xl'>Logout</p>}
            width={650}
            footer={null}
            centered
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
        >
            <Divider />
            <div className="">
                <p className='text-center text-2xl mb-10 font-normal'>Do you want to Logout ?</p>

                {/* Submit Button */}
                <div className="flex justify-center mt-2 gap-5">
                    <Button
                        type="primary"
                        onClick={handleLogout}
                        className=" h-10 w-40 px-8 text-base font-medium"
                    >
                        Yes
                    </Button>
                    <Button
                        type="default"
                        onClick={onClose}
                        className=" h-10 w-40  px-8 text-base font-medium"
                    >
                        No
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default LogoutModal;