import React, { useState } from 'react';
import { Button, Modal, Tooltip, Divider, Popconfirm, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
//icons
import WrongIcon from "../../assets/icons/wrong-status-icon.svg?react";
import RightIcon from "../../assets/icons/right-status-icon.svg?react";
import AmbiguousIcon from "../../assets/icons/ambigous-status-icon.svg?react";
import QuestionIcon from "../../assets/icons/question-icon.svg?react"
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
// import useAddReview from 'pages/dashboard/core/hooks/useAddReview';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import useMoveQuestionToPandingPool from 'pages/reviewed-questions/core/hooks/useMoveQuestionToPandingPool';
import usePublishQuestion from 'pages/reviewed-questions/core/hooks/usePublishQuestion';
import useDeleteQuestion from 'pages/questionNCategory/questions/hooks/useDeleteQuestion';
import useChangeReviewedQuestionStatus from 'pages/reviewed-questions/core/hooks/useChangeReviewedQuestionStatus';
import { getUser } from 'auth';
import { hasPermission } from 'helpers/CustomHelpers';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';

interface QuestionReviewModalProps {
    open: boolean;
    onClose: () => void;
    getReviewQuestionData: () => void;
    questionData: any;
    currentLanguage: string;
    activeTab: string;
}


const QuestionReviewModal: React.FC<QuestionReviewModalProps> = ({ activeTab, getReviewQuestionData, open, onClose, questionData, currentLanguage }) => {
    const CURRENT_USER = getUser();
    const direction = useDirection();
    const { t } = useTranslation();
    const { publishQuestionMutate, isLoading } = usePublishQuestion();
    const { isLoading: pandingPoolLoading, moveQuestionToPandingPoolMutate } = useMoveQuestionToPandingPool();
    const { deleteQuestionMutate, isQuestionLoading } = useDeleteQuestion();
    const [selectedStatus, setSelectedStatus] = useState<string>(questionData.status);
    const { changeReviewedQuestionStatusMutate, isLoading: isChangeStatusLoading } = useChangeReviewedQuestionStatus();



    const getQuestionText = () => {
        return questionData?.questionText?.[currentLanguage] || questionData?.questionText?.en || '';
    };
    const getAnswerExplanationText = () => {
        return questionData?.answerExplanation?.[currentLanguage] || questionData?.answerExplanation?.en || '';
    };

    const getOptions = () => {
        return questionData?.options?.[currentLanguage] || questionData?.options?.en || [];
    };

    const getCorrectAnswer = () => {
        return questionData?.correctAnswer?.[currentLanguage] || questionData?.correctAnswer?.en || '';
    };

    const getCategoryName = () => {
        return questionData?.categoryName?.[currentLanguage] || questionData?.categoryName?.en || null;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-800 border-green-200';
            case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'hard': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const renderMedia = (mediaUrl: string) => {
        if (!mediaUrl) return null;
        const mediaType = getMediaType(mediaUrl)

        switch (mediaType) {
            case 'image':
                return (
                    <div className="mt-2">
                        <img
                            loading='lazy'
                            src={mediaUrl}
                            alt="Question media"
                            className="w-full h-48 object-contain rounded-lg border"
                        />
                    </div>
                );
            case 'audio':
                return (
                    <div className="mt-2">
                        <audio controls className="w-full">
                            <source src={mediaUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                );
            case 'video':
                return (
                    <div className="mt-2">
                        <video controls className="w-full h-48 rounded-lg border">
                            <source src={mediaUrl} type="video/mp4" />
                            Your browser does not support the video element.
                        </video>
                    </div>
                );
            default:
                return null;
        }
    };

    // Supported media types for all browsers
    type SupportedImageTypes = 'jpg' | 'jpeg' | 'png' | 'gif' | 'bmp' | 'webp';
    type SupportedAudioTypes = 'mp3' | 'wav' | 'ogg' | 'aac' | 'm4a';
    type SupportedVideoTypes = 'mp4' | 'webm' | 'ogg' | 'wav';

    type MediaType = 'image' | 'audio' | 'video' | 'unknown';

    // Helper function to extract file extension and determine media type
    const getMediaType = (mediaUrl: string): MediaType => {
        if (!mediaUrl) return 'unknown';
        const extensionMatch = mediaUrl.split('.').pop()?.toLowerCase().split(/\#|\?/)[0];
        if (!extensionMatch) return 'unknown';

        const imageTypes: SupportedImageTypes[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const audioTypes: SupportedAudioTypes[] = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
        const videoTypes: SupportedVideoTypes[] = ['mp4', 'webm', 'ogg'];

        if (imageTypes.includes(extensionMatch as SupportedImageTypes)) {
            return 'image';
        }
        if (audioTypes.includes(extensionMatch as SupportedAudioTypes)) {
            return 'audio';
        }
        if (videoTypes.includes(extensionMatch as SupportedVideoTypes)) {
            return 'video';
        }
        return 'unknown';
    };

    const options = getOptions();
    const correctAnswer = getCorrectAnswer();

    const handlePublishQuestion = () => {
        const body = {
            questionId: questionData?.questionId,
        }

        publishQuestionMutate(body, {
            onSuccess: async () => {
                showSuccessMessage('Question published successfully.');
                getReviewQuestionData();
                onClose();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },
        });
    };

    const handleMoveToPanding = () => {
        const body = {
            questionId: questionData?.questionId,
        }

        moveQuestionToPandingPoolMutate(body, {
            onSuccess: async () => {
                showSuccessMessage('Question moved successfully.');
                getReviewQuestionData();
                onClose();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },
        });
    };


    const handleDeleteClick = () => {
        let id = questionData?._id;
        deleteQuestionMutate(id, {
            onSuccess: () => {
                showSuccessMessage('Question deleted successfully.');
                getReviewQuestionData();
                onClose()
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },
        });
    };

    const QuestionStatusOptions = [
        { value: "Approved", label: "Right" },
        { value: "Rejected", label: "Wrong" },
        { value: "Ambiguous", label: "Ambiguous" },
    ]
    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        const body = {
            "questionId": questionData.questionId,
            "status": value
        }
        changeReviewedQuestionStatusMutate(body, {
            onSuccess: () => {
                showSuccessMessage("Status updated successfully.");
                getReviewQuestionData();
                onClose()
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
            },
        }
        );
    };

    const statusOptions = () => {
        return QuestionStatusOptions.map((option: any) => ({
            value: option.value,
            label: (
                <div className="flex items-center gap-2">
                    <span className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{t(option.label)}</span>
                </div>
            ),
        }));
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={
                <div className="flex max-w-[95%] items-center justify-between gap-2">
                    <div className='flex items-center gap-x-5'>
                        <QuestionIcon />
                        <p className='font-normal text-2xl'>{t("Question")}</p>
                    </div>
                    <div className='flex items-center gap-x-2 font-normal'>
                        <Tooltip title={questionData?.suggestedById}>
                            <p className='truncate max-w-[50px]'>{questionData?.suggestedById}</p>
                        </Tooltip>
                        <p >{questionData?.suggestedByName}</p>
                    </div>
                </div>
            }
            width={600}
            footer={null}
            centered
            maskClosable={false}
            className={`question-review-modal ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
        >
            {isLoading || pandingPoolLoading || isQuestionLoading || isChangeStatusLoading ? <FallbackLoader isModal={true} /> : <></>}
            <div>

                {/* Tags and Reviews */}
                <div className="flex items-center gap-3 mb-6 mt-5">
                    {getCategoryName() &&
                        <Tooltip title={getCategoryName()}>
                            <span className="truncate max-w-[150px] px-3 py-2 bg-[#A2A2A2] text-white rounded border-[#747474] text-sm">
                                {getCategoryName()}
                            </span>
                        </Tooltip>
                    }
                    <span className={`px-3 py-2 rounded capitalize text-sm border ${getDifficultyColor(questionData?.difficulty)}`}>
                        {questionData?.difficulty}
                    </span>
                    <div className="flex items-center px-3 py-2 gap-3 border rounded flex-1">
                        {questionData.reviews?.length > 0 ? (
                            questionData.reviews.map((review: any, index: number) => (
                                <div key={index} className="flex  items-center gap-1">
                                    <Tooltip title={review.reviewerName}>
                                        <span className="text-sm text-gray-700 max-w-[100px] truncate">{review.reviewerName}</span>
                                    </Tooltip>
                                    {review.decision === 'Correct' && <RightIcon />}
                                    {review.decision === 'Incorrect' && <WrongIcon />}
                                    {review.decision === 'Ambiguous' && <AmbiguousIcon />}
                                </div>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400">{t("No reviews yet")}</span>
                        )}
                    </div>
                </div>
                <Divider />
                <div className='mb-3 flex items-center gap-x-10'>
                    <h3 className="text-sm text-gray-700 mb-2">{t("Status")}</h3>
                    <Select
                        disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                        className="w-full h-10"
                        options={statusOptions()}
                        value={selectedStatus}
                        onChange={handleStatusChange}
                    />
                </div>
                {/* Question Section */}
                <div className="mb-6">
                    <h3 className="text-sm text-gray-700 mb-2">{t("Question")}</h3>
                    <p className="text-base font-normal text-gray-900 mb-3">{getQuestionText()}</p>
                    {questionData?.mediaUrl && renderMedia(questionData.mediaUrl)}
                </div>

                {/* Answer Options */}
                {options.length > 0 && <div className="mb-6">
                    <h3 className="text-sm text-gray-700 mb-2">{t("Answer Options")}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {options.map((option: string, index: number) => {
                            const isCorrect = option === correctAnswer;
                            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

                            return (
                                <button
                                    key={index}
                                    className={`cursor-default p-4 text-left rounded-lg border-2 transition-all ${isCorrect
                                        ? 'bg-green-50 border-green-300 text-green-800'
                                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="font-medium">({optionLetter})</span> {option}
                                </button>
                            );
                        })}
                    </div>
                </div>}

                {/* Answer Explanation */}
                {questionData?.answerExplanation && (
                    <div className="mb-6">
                        <h3 className="text-sm text-gray-700 mb-2">{t("Answer Explanation")}</h3>
                        <p className="text-base font-normal text-gray-900 mb-3">{getAnswerExplanationText()}</p>
                        {questionData?.answerMediaUrl && renderMedia(questionData.answerMediaUrl)}
                    </div>
                )}
                <Divider />
                {/* Submit Review Section */}
                <div className='flex justify-between'>
                    <Button
                        type="primary"
                        onClick={handlePublishQuestion}
                        className={`h-12 font-normal `}
                        disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                    >
                        {t("Publish Question")}
                    </Button>
                    <div className='flex gap-x-2'>
                        {activeTab !== "Approved" && activeTab !== "Live" ?
                            <Button
                                type="primary"
                                onClick={handleMoveToPanding}
                                disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                                className={`h-12 font-normal `}
                            >
                                {t("Move to pending")}
                            </Button>
                            : null
                        }
                        <Popconfirm
                            title={t("Are you sure to delete this question?")}
                            onConfirm={handleDeleteClick}
                            okText={t("Yes")}
                            cancelText={t("No")}
                            disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                        >
                            <Button
                                type="default"
                                disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                                className={`h-12 font-normal bg-[#434547] text-white border-[#434547] `}
                            >
                                {t("Discard")}
                            </Button>
                        </Popconfirm>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default QuestionReviewModal;