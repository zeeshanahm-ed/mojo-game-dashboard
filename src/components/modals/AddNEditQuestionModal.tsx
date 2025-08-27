import { useEffect, useRef, useState } from "react";
import { Button, Divider, Input, Modal, Select } from "antd";
import { useGetAllCategoriesDataForDropDown } from "store/AllCategoriesData";

import UploadImageIcon from "assets/icons/image-icon.svg?react";
import VideoIcon from "assets/icons/video-icon.svg?react";
import AudioIcon from "assets/icons/audio-icon.svg?react";
import { MdDelete, MdOutlineFileUpload } from "react-icons/md";
import { LuCirclePlus } from "react-icons/lu";
import ShuffleIcon from "assets/icons/shuffle-icon.svg?react";
import { MdArrowBack } from 'react-icons/md';

type Mode = "online" | "offline";

interface StateType {
    questionMediaObj: File | null;
    answerMediaObj: File | null;
    mode: Mode;
    step: number;
    selectedCategory: string | null;
    selectedDifficulty: string | null;
    selectedQuestionType: string | null;
    page: number;
    hasMore: boolean;
    categoriesOptions: { value: string; label: string }[];
}

interface OfflineQuestionNAnswerData {
    questionEN: string | undefined;
    questionAR: string | undefined;
    questionMedia: string | undefined;
    answerEN: string | undefined;
    answerAR: string | undefined;
    answerMedia: string | undefined;
}

type OptionType = {
    english: string;
    arabic: string;
};

interface QuestionNAnswerProps {
    open: boolean;
    onClose: () => void;
};

const DifficultyOptions = [
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
    const [options, setOptions] = useState<OptionType[]>([
        { english: "", arabic: "" },
        { english: "", arabic: "" },
        { english: "", arabic: "" },
        { english: "", arabic: "" },
    ]);
    const { categoriesData } = useGetAllCategoriesDataForDropDown();
    const PAGE_SIZE = 10;

    const [state, setState] = useState<StateType>({
        questionMediaObj: null,
        answerMediaObj: null,
        mode: "offline",
        step: 1,
        selectedCategory: null,
        selectedDifficulty: null,
        selectedQuestionType: "simpleQuestion",
        page: 1,
        hasMore: true,
        categoriesOptions: [],
    });

    const questionFileInputRef = useRef<HTMLInputElement>(null);
    const triggerQuestionFileInput = () => {
        questionFileInputRef.current?.click();
    };
    const answerFileInputRef = useRef<HTMLInputElement>(null);
    const triggerAnswerFileInput = () => {
        answerFileInputRef.current?.click();
    };


    // Load options when `page` changes
    useEffect(() => {
        if (!categoriesData?.length) return;
        const start = (state.page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const newOptions = categoriesData.slice(start, end).map((cat: any) => ({
            value: cat.id,
            label: cat.name,
        }));

        setState(prev => ({
            ...prev,
            categoriesOptions: [...prev.categoriesOptions, ...newOptions],
            hasMore: end < categoriesData.length
        }));
    }, [state.page, categoriesData]);

    // Detect scroll inside dropdown
    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5 && state.hasMore) {
            setState(prev => ({
                ...prev,
                page: prev.page + 1
            }));
        }
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
                setState(prev => ({
                    ...prev,
                    questionMediaObj: file
                }));
            } else if (name === "answerMedia") {
                setState(prev => ({
                    ...prev,
                    answerMediaObj: file
                }));
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
    const handleAddOptions = () => {
        setState(prev => ({
            ...prev,
            step: 1
        }));
    };

    const handleGoOptions = () => {
        setState(prev => ({
            ...prev,
            step: 2
        }));
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
        setState(prev => ({
            ...prev,
            questionMediaObj: null,
            answerMediaObj: null
        }));
    };

    const handleChange = (index: number, field: keyof OptionType, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
    };

    const handleTranslate = (index: number) => {
        const updatedOptions = [...options];
        updatedOptions[index].arabic = "ترجمة: " + updatedOptions[index].english;
        setOptions(updatedOptions);
    };

    const handleSelectChange = (value: string, field: keyof StateType) => {
        setState((prev) => ({
            ...prev,
            [field]: value,
            mode: value === "simpleQuestion" ? "offline" : "online",
        }));
    };

    return (

        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={700}
            title={
                <div className="flex items-center gap-2">
                    {state.step === 2 &&
                        <button
                            type="button"
                            className="focus:outline-none w-5 h-5 md:w-8 md:h-8 flex items-center justify-center rounded-full text-medium-gray hover:text-black  hover:bg-light-gray transition-colors duration-300"
                            onClick={() => setState(prev => ({ ...prev, step: 1 }))}
                            aria-label="Close"
                        >
                            <MdArrowBack className='text-base md:text-2xl' />
                        </button>
                    }
                    <p className='font-normal text-2xl'>Add New Question</p>
                </div>
            }
        >
            <Divider />
            <div className='w-full  space-y-5 h-auto max-h-[800px]'>
                {state.step === 1 ?
                    <>
                        <div className="flex items-center justify-between gap-x-5">
                            <div className="flex flex-col gap-y-2">
                                <label className="text-base">Assign Category</label>
                                <Select
                                    allowClear={false}
                                    options={state.categoriesOptions}
                                    onChange={(value) => handleSelectChange(value, "selectedCategory")}
                                    value={state.selectedCategory || undefined}
                                    placeholder="Assign Category"
                                    className="h-12 w-48"
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                    onPopupScroll={handlePopupScroll}
                                />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <label className="text-base">Choose Difficulty</label>
                                <Select
                                    allowClear={false}
                                    options={DifficultyOptions}
                                    placeholder="Choose Difficulty"
                                    className='h-12 w-48'
                                    onChange={(value) => handleSelectChange(value, "selectedDifficulty")}
                                    value={state.selectedDifficulty || undefined}
                                />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <label className="text-base">Question Type</label>
                                <Select
                                    allowClear={false}
                                    options={QuestionTypeOptions}
                                    onChange={(value) => handleSelectChange(value, "selectedQuestionType")}
                                    value={state.selectedQuestionType || undefined}
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
                                    <div className={`w-full flex-col gap-4 ${state.mode === 'online' ? 'hidden' : 'flex'}`}>
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
                                                    <span className="truncate  ml-5 mt-1">{state.questionMediaObj?.name}</span>
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
                                    <div className={`w-full flex-col gap-4 ${state.mode === 'online' ? 'hidden' : 'flex'}`}>
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
                                                    <span className="truncate  ml-5 mt-1">{state.answerMediaObj?.name}</span>
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
                            {/* MCQs */}
                            {<div>
                                <h2 className='w-full  text-lg mb-5 flex items-center gap-x-5'>Add MCQ’S</h2>
                                <button className="w-10 h-10 border-border-gray rounded-lg bg-[#F5F5F5] flex-centered" onClick={handleGoOptions}>
                                    <LuCirclePlus size={20} />
                                </button>
                            </div>}
                        </div>
                    </>
                    :
                    <>
                        <div className="space-y-6">
                            {options.map((opt, index) => (
                                <div key={index} className="space-y-1">
                                    <p className="font-medium">Option {index + 1}</p>

                                    <div className="flex items-center gap-3">
                                        {/* English Input */}
                                        <div className="flex flex-col flex-1">
                                            <Input
                                                placeholder="Type option"
                                                value={opt.english}
                                                onChange={(e) => handleChange(index, "english", e.target.value)}
                                                className="flex-1 h-14"
                                            />
                                            <span className="text-xs text-gray-500 mt-1">English</span>
                                        </div>

                                        {/* Shuffle Icon */}
                                        <span className="flex-shrink-0 -mt-5">
                                            <ShuffleIcon />
                                        </span>

                                        {/* Translate Button */}
                                        <div className="w-2/5 ">
                                            <button
                                                onClick={() => handleTranslate(index)}
                                                className="w-full h-12 rounded-lg border underline font-medium hover:no-underline"
                                            >
                                                {opt.arabic ? opt.arabic : "Translate"}
                                            </button>
                                            <span className="text-xs text-gray-500 mt-1">Arabic</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </>
                }
                <Divider />
                {state.step === 1 ?
                    <div className='w-full flex items-center justify-between mt-5'>
                        <Button variant="text" className="h-12 bg-black text-white" onClick={handleAddQuestion}>
                            Bulk Upload <MdOutlineFileUpload size={20} />
                        </Button>
                        <Button variant="text" type="primary" className="h-12" onClick={handleAddQuestion}>
                            Add Question
                        </Button>
                    </div> :
                    <div className='w-full flex items-center justify-end mt-5'>
                        <Button variant="text" type="primary" className="h-12" onClick={handleAddOptions}>
                            Add Options
                        </Button>
                    </div>
                }
            </div>
        </Modal >
    )
};

export default AddNEditQuestionModal;