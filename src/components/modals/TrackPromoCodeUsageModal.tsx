
import React, { useEffect, useState } from 'react';
import { Modal, Divider, Input } from 'antd';
//icons
import { CloseOutlined } from '@ant-design/icons';


interface TrackPromoCodeUsageModalProps {
    open: boolean;
    onClose: () => void;
    promoCodeData: any | null;
}

interface StateType {
    promoCode: string;
    percentage: number;
}


const TrackPromoCodeUsageModal: React.FC<TrackPromoCodeUsageModalProps> = ({
    open,
    onClose,
    promoCodeData
}) => {
    const [state, setState] = useState<StateType>({
        promoCode: "",
        percentage: 0,
    });

    useEffect(() => {
        if (promoCodeData) {
            setState({
                promoCode: promoCodeData?.promoCode || "",
                percentage: promoCodeData?.percentage || 0,
            });

        }
    }, [promoCodeData]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={<p className='font-normal text-2xl'>Track Promo usage</p>}
            width={650}
            footer={null}
            centered
            maskClosable={false}
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
        >
            <Divider />
            <div className="">
                <div>
                    <label className="text-lg">Promo Code</label>
                    <Input
                        placeholder="Enter promo code"
                        className="h-12 w-full"
                        readOnly
                        value={state.promoCode}
                    />
                </div>
                <div>

                </div>
            </div>
        </Modal>
    );
};

export default TrackPromoCodeUsageModal;