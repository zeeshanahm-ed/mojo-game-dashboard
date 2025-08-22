import { useEffect, useRef, useState } from "react";
import { Button, Divider, Input, Modal, Select, Spin } from "antd";

import UploadImageIcon from "assets/icons/image-icon.svg?react";
import VideoIcon from "assets/icons/video-icon.svg?react";
import AudioIcon from "assets/icons/audio-icon.svg?react";
import { MdDelete, MdOutlineFileUpload } from "react-icons/md";
import { Option } from "antd/es/mentions";
import useCategoriesData from "pages/questionNCategory/categories/core/hooks/useCategoriesData";

interface OfflineQuestionNAnswerData {
    questionEN: string | undefined;
    questionAR: string | undefined;
    questionMedia: string | undefined;
    answerEN: string | undefined;
    answerAR: string | undefined;
    answerMedia: string | undefined;
}


interface QuestionNAnswerProps {
    open: boolean;
    onClose: () => void;
};

const DifficultyOptions = [
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'medium', label: 'Medium', points: 400 },
    { value: 'hard', label: 'Hard', points: 600 },
];
const QuestionTypeOptions = [
    { value: 'simpleQuestion', label: 'Simple Question' },
    { value: 'multipleChoice', label: "MCQ's Question" },
];

const AddNEditQuestionModal = ({ open, onClose }: QuestionNAnswerProps) => {
    const [questionState, setQuestionState] = useState<OfflineQuestionNAnswerData | null>({
        questionEN: "",
        questionAR: "",
        questionMedia: "",
        answerEN: "",
        answerAR: "",
        answerMedia: "",
    });
    const [questionMediaObj, setQuestionMediaObj] = useState<File | null>(null);
    const [answerMediaObj, setAnswerMediaObj] = useState<File | null>(null);
    const [mode, setMode] = useState<'online' | 'offline'>('offline');

    const questionFileInputRef = useRef<HTMLInputElement>(null);
    const triggerQuestionFileInput = () => {
        questionFileInputRef.current?.click();
    };
    const answerFileInputRef = useRef<HTMLInputElement>(null);
    const triggerAnswerFileInput = () => {
        answerFileInputRef.current?.click();
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setQuestionState((prevState) => {
            return {
                ...prevState,
                [name]: value
            } as OfflineQuestionNAnswerData;
        });
    };

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const name = event.target.name;
        if (file) {
            if (name === "questionMedia") {
                setQuestionMediaObj(file);
            } else if (name === "answerMedia") {
                setAnswerMediaObj(file);
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setQuestionState((prevState) => {
                    return {
                        ...prevState,
                        [name]: reader.result as string
                    } as OfflineQuestionNAnswerData;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = (name: string) => {
        setQuestionState((prevState) => {
            return {
                ...prevState,
                [name]: ""
            } as OfflineQuestionNAnswerData;
        });
    };

    const handleAddQuestion = () => {
        if (questionState) {
            resetState();
        }
    };

    const resetState = () => {
        setQuestionState({
            questionEN: "",
            questionAR: "",
            questionMedia: "",
            answerEN: "",
            answerAR: "",
            answerMedia: "",
        });
        setQuestionMediaObj(null);
        setAnswerMediaObj(null);
    };


    // const { categories,refetch } = useCategoriesData();

    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fake API fetch
    const fetchOptions = async (pageNum: number) => {
        setLoading(true);

        // Simulate API call
        return new Promise<{ value: string; label: string }[]>((resolve) => {
            setTimeout(() => {
                const newOptions = Array.from({ length: 20 }, (_, i) => {
                    const id = (pageNum - 1) * 20 + i + 1;
                    return { value: `option-${id}`, label: `Option ${id}` };
                });
                resolve(newOptions);
            }, 800);
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        (async () => {
            const newOptions = await fetchOptions(page);
            setOptions((prev) => [...prev, ...newOptions]);

            if (newOptions.length < 20) setHasMore(false); // No more data
        })();
    }, [page]);

    // Detect scroll to bottom inside dropdown
    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    };



    return (

        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={700}
            title={<p className='font-normal text-2xl'>Add new Question</p>}
        >
            <Divider />
            <div className='w-full  space-y-5 h-auto max-h-[800px]'>
                <div className="flex items-center justify-between gap-x-5">
                    <div className="flex flex-col gap-y-2">
                        <label className="text-base">Assign Category</label>
                        <Select
                            allowClear
                            options={DifficultyOptions}
                            placeholder="Assign Category"
                            className='h-12 w-48'
                            virtual
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            onPopupScroll={handlePopupScroll}
                            notFoundContent={loading ? <Spin size="small" /> : null}
                        >
                            {options.map((opt) => (
                                <Option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label className="text-base">Choose Difficulty</label>
                        <Select
                            allowClear
                            options={QuestionTypeOptions}
                            placeholder="Choose Difficulty"
                            className='h-12 w-48'
                        />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label className="text-base">Question Type</label>
                        <Select
                            allowClear
                            options={QuestionTypeOptions}
                            placeholder="Question Type"
                            className='h-12 w-48'
                        />
                    </div>
                </div>
                <div className='space-y-5 overflow-y-auto h-auto max-h-[600px]'>
                    {/* Question */}
                    <div>
                        <h2 className='w-full  text-lg mb-5 flex items-center gap-x-5'>Add Question <span className='h-[2px] flex-1 bg-border-gray'></span></h2>
                        <div className='space-y-5'>
                            <Input
                                name='questionEN'
                                type='text'
                                placeholder="Question"
                                value={questionState?.questionEN}
                                onChange={(e) => handleOnChange(e)}
                                className="w-full px-4"
                            />
                            <div className='relative'>
                                <button className='absolute top-4 left-5 z-50  underline hover:no-underline'>
                                    Translate
                                </button>
                                <Input
                                    type='text'
                                    name='questionAR'
                                    readOnly
                                    placeholder="Question Translation"
                                    value={questionState?.questionAR}
                                    onChange={(e) => handleOnChange(e)}
                                    className="w-full text-end px-4"
                                />
                            </div>
                            <div className={`w-full flex-col gap-4 ${mode === 'online' ? 'hidden' : 'flex'}`}>
                                <div className="relative w-full h-14 px-4 transform rounded-lg overflow-hidden border border-border-gray flex items-center justify-center">
                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        ref={questionFileInputRef}
                                        name="questionMedia"
                                        onChange={handleProfilePictureChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {questionState?.questionMedia ?
                                        <>
                                            <img
                                                src={(typeof questionState.questionMedia === 'string' ? questionState.questionMedia : "")}
                                                alt="preview"
                                                className="w-8 h-8 object-contain"
                                                width={96}
                                                loading="lazy"
                                                height={96}
                                            />
                                            <span className="truncate  ml-5 mt-1">{questionMediaObj?.name}</span>
                                            <button
                                                className="ml-auto"
                                                onClick={() => handleRemove("questionMedia")}
                                            >
                                                <MdDelete className="text-danger" size={24} />
                                            </button>
                                        </>
                                        :

                                        <button
                                            className="w-full h-full  cursor-pointer flex items-center justify-between gap-x-5 bg-white hover:text-medium-gray transition-colors duration-300"
                                            onClick={triggerQuestionFileInput}
                                        >
                                            <span className="border-r h-full pe-4 flex-centered border-border-gray text-center ">Upload Media</span>
                                            <div className='flex items-center justify-between flex-1 px-8'>
                                                <div className='flex-centered gap-x-4'>
                                                    <UploadImageIcon />
                                                    <span className="text-base ">Photo</span>
                                                </div>
                                                <div className='flex-centered gap-x-4'>
                                                    <VideoIcon />
                                                    <span className="text-base ">Video</span>
                                                </div>
                                                <div className='flex-centered gap-x-4'>
                                                    <AudioIcon />
                                                    <span className="text-base ">Audio</span>
                                                </div>
                                            </div>
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Answer */}
                    <div>
                        <h2 className='w-full  text-lg mb-5 flex items-center gap-x-5'>Add Answer <span className='h-[2px] flex-1 bg-border-gray'></span></h2>
                        <div className='space-y-5'>
                            <Input
                                name='answerEN'
                                type='text'
                                placeholder="Answer"
                                value={questionState?.answerEN}
                                onChange={(e) => handleOnChange(e)}
                                className="w-full px-4"
                            />
                            <div className='relative'>
                                <button className='absolute top-4 left-5 z-50  underline hover:no-underline'>
                                    Translate
                                </button>
                                <Input
                                    type='text'
                                    name='answerAR'
                                    readOnly
                                    placeholder="Answer Translation"
                                    value={questionState?.answerAR}
                                    onChange={(e) => handleOnChange(e)}
                                    className="w-full border text-end px-4"
                                />
                            </div>
                            <div className={`w-full flex-col gap-4 ${mode === 'online' ? 'hidden' : 'flex'}`}>
                                <div className="relative w-full h-14 px-4 rounded-lg transform overflow-hidden border border-border-gray flex items-center justify-center">
                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        ref={answerFileInputRef}
                                        name="answerMedia"
                                        onChange={handleProfilePictureChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {questionState?.answerMedia ?
                                        <>
                                            <img
                                                src={(typeof questionState.answerMedia === 'string' ? questionState.answerMedia : "")}
                                                alt="preview"
                                                className="w-8 h-8 object-contain"
                                                width={96}
                                                height={96}
                                                loading="lazy"
                                            />
                                            <span className="truncate  ml-5 mt-1">{answerMediaObj?.name}</span>
                                            <button
                                                className="ml-auto"
                                                onClick={() => handleRemove("answerMedia")}
                                            >
                                                <MdDelete className="text-danger" size={24} />
                                            </button>
                                        </>

                                        :

                                        <button
                                            className="w-full h-full  cursor-pointer flex items-center justify-between gap-x-5 bg-white hover:text-medium-gray transition-colors duration-300"
                                            onClick={triggerAnswerFileInput}
                                        >
                                            <span className="border-r h-full pe-4 flex-centered border-border-gray text-center ">Upload Media</span>
                                            <div className='flex items-center justify-between flex-1 px-8'>
                                                <div className='flex-centered gap-x-4'>
                                                    <UploadImageIcon />
                                                    <span className="text-base ">Photo</span>
                                                </div>
                                                <div className='flex-centered gap-x-4'>
                                                    <VideoIcon />
                                                    <span className="text-base ">Video</span>
                                                </div>
                                                <div className='flex-centered gap-x-4'>
                                                    <AudioIcon />
                                                    <span className="text-base ">Audio</span>
                                                </div>
                                            </div>
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className='w-full flex items-center justify-between mt-5'>
                    <Button variant="text" className="h-12 bg-black text-white" onClick={handleAddQuestion}>
                        Bulk Upload <MdOutlineFileUpload size={20} />
                    </Button>
                    <Button variant="text" type="primary" className="h-12" onClick={handleAddQuestion}>
                        Add Question
                    </Button>
                </div>
            </div>
        </Modal >
    )
};

export default AddNEditQuestionModal;