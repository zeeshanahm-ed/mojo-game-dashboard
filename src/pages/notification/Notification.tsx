import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Empty, Pagination, Spin } from 'antd';
import { useHeaderProps } from 'components/core/use-header-props';
import useGetAllNotification from 'components/layout/components/core/hooks/useGetAllNotification';
import useUpdateNotification from 'components/layout/components/core//hooks/useUpdateNotification';
import useDeleteSingleNotification from 'components/layout/components/core/hooks/useDeleteNotification';
//icons
import { BellOutlined, ArrowRightOutlined } from '@ant-design/icons';
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import useBack from 'hooks/use-back';



function Notification() {
    const { setTitle, setBack } = useHeaderProps();
    const { handleBack } = useBack();

    const [listing, setListing] = useState({
        page: 1,
    });
    const { allNotifications, refetchNotifications, isLoadingCase } = useGetAllNotification(listing);
    const { mutate: notificationMutate } = useUpdateNotification();
    const { mutate: deleteSingleNotification } = useDeleteSingleNotification();
    const navigate = useNavigate();

    useEffect(() => {
        setTitle('Notification');
        setBack(() => handleBack);

        return () => {
            setBack(undefined);
        };
    }, [setTitle, setBack,]);

    const handleReadAllNotification = () => {
        try {
            notificationMutate(undefined, {
                onSuccess: async () => {
                    refetchNotifications();
                },
                onError: (error) => {
                    console.error('Failed to get signed URL', error);
                },
            });
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    };

    useEffect(() => {
        handleReadAllNotification();
    }, [])

    const redirectToFormUpload = (id: string) => {
        navigate(`/services/service-detail/${id}`);
    };
    const handlePageChange = (page: any) => {
        setListing(prev => ({ ...prev, page: page }));
    };

    const handleSingleNotifiDelete = (id: string) => {
        try {
            deleteSingleNotification(id, {
                onSuccess: async () => {
                    refetchNotifications();
                },
                onError: (error: any) => {
                    console.error('Failed to get signed URL', error);
                },
            });
        } catch (error) {
            console.error('Error updating notification:', error);
        }

    };


    return (
        <div className="flex justify-center items-start mb-10">
            {isLoadingCase ?
                <div className='flex justify-center items-center h-32'>
                    <Spin size="large" />
                </div>
                :
                <div className="w-full overflow-hidden">
                    {allNotifications?.data?.totalItems > 0 ? (
                        <>
                            {allNotifications?.data?.data?.map((notification: any) => (
                                <div
                                    key={notification._id}
                                    className={`rounded flex items-center justify-between p-4 md:p-5 border-b border-gray-200`}
                                    style={{ transition: 'background-color 0.2s ease-in-out' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                                >
                                    {/* Left section: Icon and Text */}
                                    <div className="flex items-center space-x-3 md:space-x-4 flex-grow">
                                        <BellOutlined className="text-blue-500 text-xl md:text-2xl flex-shrink-0" />
                                        <p className="text-gray-800 text-sm md:text-base leading-snug flex-grow">
                                            {notification?.body}
                                        </p>
                                    </div>

                                    {/* Right section: Action Text and Arrow Icon */}
                                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4 md:ml-6" aria-label="notification-action" onClick={() => redirectToFormUpload(notification?.case)}>
                                        <span className=" text-sm text-light-gray whitespace-nowrap hover:underline cursor-pointer">
                                            Go to Authorization Form Upload
                                        </span>
                                        <ArrowRightOutlined className="text-light-gray" />
                                    </div>
                                    <div className='ml-8'>
                                        <Button className='border-0 shadow-none bg-transparent p-2' onClick={() => handleSingleNotifiDelete(notification?._id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <Empty className="my-12" description="Empty" />
                    )}
                    {/* Pagination */}
                    {allNotifications?.data?.totalItems > 0 && <div className="flex justify-center mt-6">
                        <Pagination
                            current={allNotifications?.data?.currentPage}
                            pageSize={allNotifications?.data?.pageSize}
                            total={allNotifications?.data?.totalItems}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>}
                </div>}
        </div>
    )
}

export default Notification;