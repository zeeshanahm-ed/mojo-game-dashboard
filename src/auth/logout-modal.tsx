
import React from 'react';
import { Modal, Button, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';


interface PromoModalProps {
    open: boolean;
    onClose: () => void;
}


const LogoutModal: React.FC<PromoModalProps> = ({ open, onClose, }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const direction = useDirection();

    const handleLogout = () => {
        navigate('/logout');
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={<p className='font-normal text-center text-2xl'>{t('Logout')}</p>}
            width={650}
            footer={null}
            centered
            className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
        >
            <Divider />
            <div>
                <p className='text-center text-2xl mb-10 font-normal'>{t('Do you want to Logout?')}</p>

                {/* Submit Button */}
                <div className="flex justify-center mt-2 gap-5">
                    <Button
                        type="primary"
                        onClick={handleLogout}
                        className={` h-10 w-40 px-8 text-base font-medium `}
                    >
                        {t('Yes')}
                    </Button>
                    <Button
                        type="default"
                        onClick={onClose}
                        className={` h-10 w-40  px-8 text-base font-medium`}
                    >
                        {t('No')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default LogoutModal;