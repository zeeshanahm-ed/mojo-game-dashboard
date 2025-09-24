import React from 'react';
import { Button, Modal, Tooltip, Divider, Popconfirm } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
//icons
import QuestionIcon from "../../assets/icons/question-icon.svg?react"
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import useDeleteQuestion from 'pages/questionNCategory/questions/hooks/useDeleteQuestion';

interface QuestionReviewModalProps {
    open: boolean;
    onClose: () => void;
    getReviewQuestionData: () => void;
    questionData: any;
    currentLanguage: string;
}


const LiveQuestionsDetailModal: React.FC<QuestionReviewModalProps> = ({ getReviewQuestionData, open, onClose,
    questionData,
    currentLanguage
}) => {
    const { deleteQuestionMutate, isQuestionLoading } = useDeleteQuestion();


    const getQuestionText = () => {
        return questionData?.multilingualData.questionText?.[currentLanguage] || questionData?.multilingualData.questionText?.en || '';
    };
    const getAnswerExplanationText = () => {
        return questionData?.multilingualData.answerExplanation?.[currentLanguage] || questionData?.multilingualData.answerExplanation?.en || '';
    };

    const getOptions = () => {
        return questionData?.multilingualData.options?.[currentLanguage] || questionData?.multilingualData.options?.en || [];
    };

    const getCorrectAnswer = () => {
        return questionData?.multilingualData.correctAnswer?.[currentLanguage] || questionData?.multilingualData.correctAnswer?.en || '';
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

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={
                <div className="flex max-w-[95%] items-center justify-between gap-2">
                    <div className='flex items-center gap-x-5'>
                        <QuestionIcon />
                        <p className='font-normal text-2xl'>Question</p>
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
            className="question-review-modal"
            closeIcon={<CloseOutlined className="text-gray-400 hover:text-gray-600" />}
        >
            {isQuestionLoading ? <FallbackLoader isModal={true} /> : <></>}
            <div>

                {/* Tags and Reviews */}
                <div className="flex items-center gap-3 mb-6 mt-5">
                    <Tooltip title={questionData?.category.name}>
                        <span className="truncate px-3 py-2 bg-[#A2A2A2] text-white rounded border-[#747474] text-sm">
                            {questionData?.category.name}
                        </span>
                    </Tooltip>
                    <span className={`px-3 py-2 rounded capitalize text-sm border ${getDifficultyColor(questionData?.difficulty)}`}>
                        {questionData?.difficulty}
                    </span>
                    {/* <div className="flex items-center justify-between px-3 py-2 gap-2 border rounded flex-1">
                        {questionData.reviews?.length > 0 ? (
                            questionData.reviews.map((review: any, index: number) => (
                                <div key={index} className="flex  items-center gap-1">
                                    <Tooltip title={review.name}>
                                        <span className="text-sm text-gray-700 max-w-[70px] truncate">{review.name}</span>
                                    </Tooltip>
                                    {review.decession === 'correct' && <RightIcon />}
                                    {review.decession === 'incorrect' && <WrongIcon />}
                                    {review.decession === 'ambiguity' && <AmbiguousIcon />}
                                </div>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400">No reviews yet</span>
                        )}
                    </div> */}
                </div>
                <Divider />
                {/* Question Section */}
                <div className="mb-6">
                    <h3 className="text-sm text-gray-700 mb-2">Question</h3>
                    <p className="text-base font-normal text-gray-900 mb-3">{getQuestionText()}</p>

                    {/* Question Media - Replace with actual media data when available */}
                    {questionData?.mediaUrl && renderMedia(questionData.mediaUrl)}
                </div>

                {/* Answer Options */}
                {options.length > 0 && <div className="mb-6">
                    <h3 className="text-sm text-gray-700 mb-2">Answer Options</h3>
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
                        <h3 className="text-sm text-gray-700 mb-2">Answer Explanation</h3>
                        <p className="text-base font-normal text-gray-900 mb-3">{getAnswerExplanationText()}</p>

                        {/* Answer Explanation Media - Replace with actual media data when available */}
                        {questionData?.answerMediaUrl && renderMedia(questionData.answerMediaUrl)}
                    </div>
                )}
                <Divider />
                {/* Submit Review Section */}
                <div className='flex justify-end'>
                    <Popconfirm
                        title="Are you sure to delete this question?"
                        onConfirm={handleDeleteClick}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            className="h-12 font-normal"
                        >
                            Delete Question
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </Modal>
    );
};

export default LiveQuestionsDetailModal;