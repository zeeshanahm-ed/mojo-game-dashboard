import React from 'react';
import { Modal, Button, Divider } from 'antd';

interface BulkUploadResultData {
    success: number;
    failed: number;
    errors: string[];
}

interface BulkUploadResultModalProps {
    open: boolean;
    onClose: () => void;
    data: BulkUploadResultData | null;
}

const BulkUploadResultModal: React.FC<BulkUploadResultModalProps> = ({
    open,
    onClose,
    data
}) => {
    return (
        <Modal
            title={<p className='font-normal text-2xl'>Bulk Upload Results</p>}
            open={open}
            onCancel={onClose}
            footer={[
                <Button
                    key="close"
                    type="primary"
                    onClick={onClose}
                >
                    Close
                </Button>
            ]}
            width={600}
        >
            <Divider />
            {data && (
                <div className="space-y-4">
                    {/* Summary Cards */}
                    <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Successfully Uploaded</p>
                                    <p className="text-2xl font-bold text-green-700">{data.success}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                <div>
                                    <p className="text-sm text-red-600 font-medium">Failed</p>
                                    <p className="text-2xl font-bold text-red-700">{data.failed}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Details */}
                    {data.errors.length > 0 && (
                        <div>
                            <h4 className="text-lg  text-gray-800 mb-3">Error Details:</h4>
                            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <ul className="space-y-2">
                                    {data.errors.map((error, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span className="text-sm text-gray-700">{error}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default BulkUploadResultModal;
