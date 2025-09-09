import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
//components
import { Button, Divider, Input, Modal, Radio, RadioChangeEvent, Select, Upload } from "antd";
import FallbackLoader from "components/core-ui/fallback-loader/FallbackLoader";
//Hooks & Utils
import { useGetAllCategoriesDataForDropDownFromStore } from "store/AllCategoriesData";
import { AUDIO_FILE_TYPES, IMAGE_FILE_TYPES, VIDEO_FILE_TYPES } from "constants/global";
import useAddQuestion from "pages/questionNCategory/questions/hooks/useAddQuestion";
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import useUpdateQuestion from "pages/questionNCategory/questions/hooks/useUpdateQuestion";
import useGetSingleQuestion from "pages/questionNCategory/questions/hooks/useGetSingleQuestion";
import { formatFileSize, splitFileName } from "helpers/CustomHelpers";
//icons
import UploadImageIcon from "assets/icons/image-icon.svg?react";
import VideoIcon from "assets/icons/video-icon.svg?react";
import AudioIcon from "assets/icons/audio-icon.svg?react";
import { MdDelete, MdOutlineFileUpload } from "react-icons/md";
import { LuCirclePlus } from "react-icons/lu";
import ShuffleIcon from "assets/icons/shuffle-icon.svg?react";
import { MdArrowBack } from 'react-icons/md';
import { getDownloadBulkUploadTemplate, updateBulkQuestionData } from "pages/questionNCategory/questions/core/_request";

type Mode = "online" | "offline";

interface StateType {
    questionMediaObj: File | null;
    answerMediaObj: File | null;
    mode: Mode;
    step: number;
    selectedCategory: string | null;
    selectedDifficulty: string | null;
    selectedQuestionType: string | null;
    categoriesOptions: { value: string; label: string }[];
    selectedCorrectOption: OptionType | null;
    questionMediaFileName: string | null;
    answerMediaFileName: string | null;
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
    getAddedQuestionData: () => void;
    questionId: string | null;
};

type UploadedFileType = "image" | "video" | "audio";
type ErrorStateType = {
    questionMedia: string;
    answerMedia: string;
    options: string;
}

const DifficultyOptions = [
    { value: 'easy', label: 'Easy', points: 200 },
    { value: 'medium', label: 'Medium', points: 400 },
    { value: 'hard', label: 'Hard', points: 600 },
];

const QuestionTypeOptions = [
    { value: 'Direct Answer', label: 'Simple Question' },
    { value: 'MCQs', label: "MCQ's Question" },
];

const AddNEditQuestionModal = ({ open, onClose, getAddedQuestionData, questionId = null }: QuestionNAnswerProps) => {
    const { addQuestionMutate, isLoading } = useAddQuestion();
    const [uploadedFileLoading, setUploadedFileLoading] = useState<boolean>(false);
    const { questionData, isLoading: isQuestionLoading } = questionId ? useGetSingleQuestion(questionId) : { questionData: null, isLoading: false };
    const { updateQuestionMutate, isLoading: updateQuestionLoading } = useUpdateQuestion();
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

    const { categoriesData } = useGetAllCategoriesDataForDropDownFromStore();
    const [uploadedFileType, setUploadedFileType] = useState<UploadedFileType | null>(null);
    const [errorState, setErrorState] = useState<ErrorStateType>({
        questionMedia: "",
        answerMedia: "",
        options: "",
    });

    const [state, setState] = useState<StateType>({
        questionMediaObj: null,
        answerMediaObj: null,
        mode: "offline",
        step: 1,
        selectedCategory: null,
        selectedDifficulty: null,
        selectedQuestionType: "Direct Answer",
        categoriesOptions: [],
        selectedCorrectOption: null,
        questionMediaFileName: null,
        answerMediaFileName: null,
    });

    const questionFileInputRef = useRef<HTMLInputElement>(null);
    const triggerQuestionFileInput = (type: UploadedFileType) => {
        setUploadedFileType(type);
        if (!questionFileInputRef.current) return;

        if (type === "image" && questionFileInputRef.current) {
            questionFileInputRef.current.accept = ".jpg,.jpeg,.png,.gif,.webp";
        } else if (type === "video") {
            questionFileInputRef.current.accept = ".mp4,.webm,.ogg";
        } else if (type === "audio") {
            questionFileInputRef.current.accept = ".mp3,.wav,.ogg";
        }
        questionFileInputRef.current?.click();
    };

    const answerFileInputRef = useRef<HTMLInputElement>(null);
    const triggerAnswerFileInput = (type: UploadedFileType) => {
        setUploadedFileType(type);
        if (!answerFileInputRef.current) return;

        if (type === "image" && answerFileInputRef.current) {
            answerFileInputRef.current.accept = ".jpg,.jpeg,.png,.gif,.webp";
        } else if (type === "video") {
            answerFileInputRef.current.accept = ".mp4,.webm,.ogg";
        } else if (type === "audio") {
            answerFileInputRef.current.accept = ".mp3,.wav,.ogg";
        }
        answerFileInputRef.current?.click();
    };


    // Load options when `page` changes
    useEffect(() => {
        if (!categoriesData?.length) return;
        const newOptions = categoriesData?.map((cat: any) => ({
            value: cat.id,
            label: cat.name,
        }));

        setState(prev => ({
            ...prev,
            categoriesOptions: [...newOptions],
        }));
    }, [categoriesData]);

    useEffect(() => {
        if (questionData) {
            setQuestionState(prev => ({
                ...prev,
                questionEN: questionData?.multilingualData?.questionText.en,
                questionAR: questionData?.multilingualData?.questionText.ar,
                answerEN: questionData?.multilingualData?.answerExplanation.en,
                answerAR: questionData?.multilingualData?.answerExplanation.ar,
                questionMedia: questionData?.mediaUrl,
                answerMedia: questionData?.answerMediaUrl,
            }));

            const questionMediaFileName = splitFileName(questionData?.mediaUrl);
            const answerMediaFileName = splitFileName(questionData?.answerMediaUrl);

            setState(prev => ({
                ...prev,
                selectedCategory: questionData?.category?._id,
                selectedDifficulty: questionData?.difficulty,
                selectedQuestionType: questionData?.questionType,
                selectedCorrectOption: questionData?.multilingualData?.correctAnswer ? {
                    english: questionData?.multilingualData?.correctAnswer.en,
                    arabic: questionData?.multilingualData?.correctAnswer.ar,
                } : null,
                questionMediaFileName: questionMediaFileName,
                answerMediaFileName: answerMediaFileName,
                questionMediaObj: questionData?.mediaUrl,
                answerMediaObj: questionData?.answerMediaUrl,
                mode: questionData?.questionType === "MCQs" ? "online" : "offline",
            }));

            if (questionData?.options) {
                const mapped = questionData?.multilingualData?.options?.en.map((enItem: string, index: number) => ({
                    english: enItem,
                    arabic: questionData?.multilingualData?.options?.ar[index] || "",
                }));

                setOptions(mapped);
            }

        }
    }, [questionData]);


    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setQuestionState((prevState) => {
            return {
                ...prevState,
                [name]: value
            } as OfflineQuestionNAnswerData;
        });
    };

    const fileValidation = (file: File | undefined) => {
        const fileExt = file?.type.split("/")[1] || file?.name.split(".").pop();
        if (uploadedFileType === "image" && !IMAGE_FILE_TYPES.includes(`.${fileExt}`)) {
            return { error: true, message: "Image file type must be valid formate : " + IMAGE_FILE_TYPES.join(", ") };
        }
        else if (uploadedFileType === "image" && formatFileSize(file?.size) > "20") {
            return { error: true, message: "Image file size must be less than 20MB" };
        }
        else if (uploadedFileType === "video" && !VIDEO_FILE_TYPES.includes(`.${fileExt}`)) {
            return { error: true, message: "Video file type must be valid formate : " + VIDEO_FILE_TYPES.join(", ") };
        }
        else if (uploadedFileType === "video" && formatFileSize(file?.size) > "30") {
            return { error: true, message: "Video file size must be less than 30MB" };
        }
        else if (uploadedFileType === "audio" && !AUDIO_FILE_TYPES.includes(`.${fileExt}`)) {
            return { error: true, message: "Audio file type must be valid formate : " + AUDIO_FILE_TYPES.join(", ") };
        }
        else if (uploadedFileType === "audio" && formatFileSize(file?.size) > "10") {
            return { error: true, message: "Audio file size must be less than 10MB" };
        }
        return { error: false, message: "" };
    };

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const name = event.target.name;
        const error = fileValidation(file);
        if (error.error) {
            setErrorState(prev => ({
                ...prev,
                [name]: error.message
            }));
            return;
        } else {
            setErrorState(prev => ({
                ...prev,
                [name]: ""
            }));
        }
        if (file) {
            if (name === "questionMedia") {
                setState(prev => ({
                    ...prev,
                    questionMediaObj: file,
                    questionMediaFileName: file.name
                }));
            } else if (name === "answerMedia") {
                setState(prev => ({
                    ...prev,
                    answerMediaObj: file,
                    answerMediaFileName: file.name
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
        setState(prev => ({
            ...prev,
            [name + "Obj"]: null,
            [name + "FileName"]: null,
        }));
    };

    const handleAddQuestion = () => {
        if (questionState) {
            if (questionId) {
                handleUpdate();
            } else {
                handleOk();
            }
        }
    };

    const handleAddOptions = () => {
        // If there are already 4 options, validate them
        if (options.length === 4) {
            // Check for any empty option
            const emptyOption = options.find(opt => !opt.english.trim());
            if (emptyOption) {
                setErrorState(prev => ({ ...prev, options: "All options must be filled." }));
                return;
            }

            // Check for duplicate options (case-insensitive, trimmed)
            const englishOptions = options.map(opt => opt.english.trim().toLowerCase());
            const hasDuplicate = englishOptions.some((opt, idx) => englishOptions.indexOf(opt) !== idx);
            if (hasDuplicate) {
                setErrorState(prev => ({ ...prev, options: "Options must be unique." }));
                return;
            }
        }

        setState(prev => ({ ...prev, step: 1 }));
    };

    const handleGoOptions = () => {
        setState(prev => ({ ...prev, step: 2 }));
    };

    const createFormData = () => {
        const formData = new FormData();

        // Helper to safely append values
        const safeAppend = (key: string, value: any) => {
            formData.append(key, value ?? "");
        };

        safeAppend("questionType", state.selectedQuestionType);
        safeAppend("type", state.mode === "online" ? "text" : "text-and-media");
        safeAppend("categoryId", state.selectedCategory);
        safeAppend("questionText[en]", questionState?.questionEN);
        safeAppend("questionText[ar]", questionState?.questionAR);
        safeAppend("answerExplanation[en]", questionState?.answerEN);
        safeAppend("answerExplanation[ar]", questionState?.answerAR);
        safeAppend("difficulty", state.selectedDifficulty);

        const points = DifficultyOptions.find(difficulty => difficulty.value === state.selectedDifficulty)?.points;
        safeAppend("points", points !== undefined ? String(points) : "");

        if (state.mode === "online") {
            options.forEach((opt) => {
                safeAppend("options[en][]", opt.english);
                safeAppend("options[ar][]", opt.arabic);
            });

            safeAppend("correctAnswer[en]", state.selectedCorrectOption?.english);
            safeAppend("correctAnswer[ar]", state.selectedCorrectOption?.arabic);
        } else {
            if (state.questionMediaObj?.type && state.questionMediaObj?.size) {
                formData.append("media", state.questionMediaObj);
            }
            if (state.answerMediaObj?.type && state.answerMediaObj?.size) {
                formData.append("answerMedia", state.answerMediaObj);
            }
        }

        return formData;
    };

    const handleOk = () => {

        const formData = createFormData();
        if (formData) {
            addQuestionMutate(formData, {
                onSuccess: async () => {
                    showSuccessMessage('Question created successfully.');
                    resetState();
                    getAddedQuestionData();
                    handleClose();
                },
                onError: (error: unknown) => {
                    if (error instanceof AxiosError) {
                        showErrorMessage(error?.response?.data?.message);
                    } else {
                        showErrorMessage('Unknown error occurred.');
                    }
                },
            });
        }
    };

    const handleUpdate = () => {

        const formData = createFormData();
        if (formData) {
            updateQuestionMutate({ body: formData, id: questionId }, {
                onSuccess: async () => {
                    showSuccessMessage('Question updated successfully.');
                    resetState();
                    getAddedQuestionData();
                    handleClose();
                },
                onError: (error: unknown) => {
                    if (error instanceof AxiosError) {
                        showErrorMessage(error?.response?.data?.message);
                    } else {
                        showErrorMessage('Unknown error occurred.');
                    }
                },
            });
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
        setState(prev => ({
            ...prev,
            questionMediaObj: null,
            answerMediaObj: null,
            selectedCategory: null,
            selectedDifficulty: null,
            selectedQuestionType: "simpleQuestion",
            selectedCorrectOption: null,
        }));
        setOptions([
            { english: "", arabic: "" },
            { english: "", arabic: "" },
            { english: "", arabic: "" },
            { english: "", arabic: "" },
        ]);
        setErrorState({
            questionMedia: "",
            answerMedia: "",
            options: "",
        });
        setUploadedFileType(null);
    };

    const handleChange = (index: number, field: keyof OptionType, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
        setErrorState(prev => ({ ...prev, options: "" }));
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
        }));
        if (field === "selectedQuestionType") {
            setState(prev => ({ ...prev, mode: value === "MCQs" ? "online" : "offline" }));
        }
    };


    const handleSelectCorrectOption = (e: RadioChangeEvent) => {
        const correctOption = options.find(opt => opt.english === e.target.value);
        if (correctOption) {
            setState(prev => ({ ...prev, selectedCorrectOption: correctOption, }));
        }
    };

    const handleGoBackToStep1 = () => {
        setState(prev => ({ ...prev, step: 1 }));
    };

    const handleClose = () => {
        resetState();
        onClose();
    };


    const handleDisabled = () => {
        if (state.selectedQuestionType === "MCQs") {
            return !questionState?.questionEN || !questionState?.questionAR || !questionState?.answerEN || !questionState?.answerAR || !state.selectedCategory || !state.selectedDifficulty || !state.selectedCorrectOption;
        } else {
            return !questionState?.questionEN || !questionState?.questionAR || !questionState?.answerEN || !questionState?.answerAR || !state.selectedCategory || !state.selectedDifficulty || !state.questionMediaFileName || !state.answerMediaFileName;
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await getDownloadBulkUploadTemplate();

            // Create a blob link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            // ✅ try to read filename from header if backend sends it
            const contentDisposition = response.headers["content-disposition"];
            let fileName = "question-template.xlsx";
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match?.[1]) {
                    fileName = match[1];
                }
            }

            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // cleanup
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };


    const handleUploadBulkQuestions = (info: any) => {
        setUploadedFileLoading(true);
        const file = info.file;
        const acceptFileTypes = [".xls", ".xlsx"];
        const fileExt = file?.name.split(".").pop();
        if (!fileExt || !acceptFileTypes.includes(`.${fileExt}`)) {
            showErrorMessage("Invalid file type. Please upload an Excel file or download the template.");
            setUploadedFileLoading(false);
            return;
        }

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            updateBulkQuestionData(formData).then(() => {
                showSuccessMessage("Bulk questions uploaded successfully");
            }).catch((error) => {
                showErrorMessage("Error uploading bulk questions");
                console.error("Error uploading bulk questions:", error);
            }).finally(() => {
                setUploadedFileLoading(false);
            });
        }
    };


    // const getImageUrl = () => {
    //     const url = URL.createObjectURL(state.questionMediaObj as Blob);
    //     const extension = getFileExtension(url);
    //     if (state.questionMediaObj) {
    //         return url;
    //     } else {
    //         return "";
    //     }
    // };

    return (

        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            centered
            width={800}
            maskClosable={false}
            title={
                <div className="flex items-center gap-2">
                    {state.step === 2 &&
                        <button
                            type="button"
                            className="focus:outline-none w-5 h-5 md:w-8 md:h-8 flex items-center justify-center rounded-full text-medium-gray hover:text-black  hover:bg-light-gray transition-colors duration-300"
                            onClick={handleGoBackToStep1}
                            aria-label="Close"
                        >
                            <MdArrowBack className='text-base md:text-2xl' />
                        </button>
                    }
                    <p className='font-normal text-2xl'>Add New Question</p>
                </div>
            }
        >
            {(isLoading || isQuestionLoading || updateQuestionLoading || uploadedFileLoading) && <FallbackLoader isModal={true} />}
            <Divider />
            <div className='w-full space-y-5'>
                {state.step === 1 ?
                    <>
                        <div className="flex items-baseline justify-between gap-x-5">
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
                                    optionRender={(option) => (
                                        <div key={option.data.value}>
                                            <span>{option.data.label}</span>
                                        </div>
                                    )}
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
                                        <button className='absolute top-4 left-5 z-10  underline hover:no-underline'>
                                            Translate
                                        </button>
                                        <Input
                                            type='text'
                                            name='questionAR'
                                            // readOnly
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
                                                    {/* {<img
                                                        src={getImageUrl()}
                                                        alt="preview"
                                                        className="w-8 h-8 object-contain"
                                                        width={96}
                                                        loading="lazy"
                                                        height={96}
                                                    />} */}
                                                    <span className={`truncate  ${uploadedFileType === "image" ? "" : ""} mt-1`}>{state.questionMediaFileName}</span>
                                                    <button
                                                        className="ml-auto"
                                                        onClick={() => handleRemove("questionMedia")}
                                                    >
                                                        <MdDelete className="text-danger" size={24} />
                                                    </button>
                                                </>
                                                :

                                                <div className="w-full h-full  cursor-pointer flex items-center justify-between gap-x-5 bg-white" >
                                                    <span className="border-r h-full pe-4 flex-centered border-border-gray text-center ">Upload Media</span>
                                                    <div className='flex items-center justify-between flex-1 px-8'>
                                                        <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerQuestionFileInput("image")}>
                                                            <UploadImageIcon />
                                                            <span className="text-base ">Image</span>
                                                        </button>
                                                        <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerQuestionFileInput("video")}>
                                                            <VideoIcon />
                                                            <span className="text-base ">Video</span>
                                                        </button>
                                                        <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerQuestionFileInput("audio")}>
                                                            <AudioIcon />
                                                            <span className="text-base ">Audio</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        {errorState.questionMedia && <p className="text-red-500 text-sm">{errorState.questionMedia}</p>}
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
                                        <button className='absolute top-4 left-5 z-10  underline hover:no-underline'>
                                            Translate
                                        </button>
                                        <Input
                                            type='text'
                                            name='answerAR'
                                            // readOnly
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
                                                    {/* {<img
                                                        src={(typeof questionState.answerMedia === 'string' ? questionState.answerMedia : "")}
                                                        alt="preview"
                                                        className="w-8 h-8 object-contain"
                                                        width={96}
                                                        height={96}
                                                        loading="lazy"
                                                    />} */}
                                                    <span className={`truncate ${uploadedFileType === "image" ? "" : ""} mt-1`}>{state.answerMediaFileName}</span>
                                                    <button
                                                        className="ml-auto"
                                                        onClick={() => handleRemove("answerMedia")}
                                                    >
                                                        <MdDelete className="text-danger" size={24} />
                                                    </button>
                                                </>

                                                :

                                                <div className="w-full h-full  cursor-pointer flex items-center justify-between gap-x-5 bg-white">
                                                    <span className="border-r h-full pe-4 flex-centered border-border-gray text-center ">Upload Media</span>
                                                    <div className='flex items-center justify-between flex-1 px-8'>
                                                        <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerAnswerFileInput("image")}>
                                                            <UploadImageIcon />
                                                            <span className="text-base ">Image</span>
                                                        </button>
                                                        <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerAnswerFileInput("video")}>
                                                            <VideoIcon />
                                                            <span className="text-base ">Video</span>
                                                        </button>
                                                        <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerAnswerFileInput("audio")}>
                                                            <AudioIcon />
                                                            <span className="text-base ">Audio</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        {errorState.answerMedia && <p className="text-red-500 text-sm">{errorState.answerMedia}</p>}
                                    </div>
                                </div>
                            </div>
                            {/* MCQs */}
                            {state.selectedQuestionType === "MCQs" &&
                                <div className="w-full">
                                    <h2 className="w-full text-lg mb-5 flex items-center gap-x-5">Add MCQ’S <span className="text-sm text-gray-500">Select anyone with right answer</span></h2>

                                    <Radio.Group
                                        onChange={handleSelectCorrectOption}
                                        value={state.selectedCorrectOption?.english}
                                        className="flex w-full flex-wrap gap-4 mb-6"
                                    >
                                        {options.every(opt => opt.english !== "") && options.map((opt, index) => (
                                            <Radio
                                                key={index}
                                                value={opt.english}
                                                className="h-12 w-fit px-6 border rounded-lg flex-centered  hover:border-primary"
                                            >
                                                {opt.english}
                                            </Radio>
                                        ))}
                                        <button
                                            className="w-12 h-12 border border-gray-300 rounded-lg bg-[#F5F5F5] flex items-center justify-center"
                                            onClick={handleGoOptions}
                                        >
                                            <LuCirclePlus size={24} />
                                        </button>
                                    </Radio.Group>

                                </div>
                            }
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
                            {errorState.options && <p className="text-red-500 text-sm text-center">{errorState.options}</p>}
                        </div>

                    </>
                }
                <Divider />
                {state.step === 1 ?
                    <div className='w-full flex items-center justify-between mt-5'>
                        <div className="space-x-4">

                            <Upload
                                accept=".xls,.xlsx"
                                beforeUpload={() => false} // prevent auto upload
                                onChange={handleUploadBulkQuestions}
                                showUploadList={false}
                            >
                                <Button variant="text" className="h-12 border-none bg-black text-white">
                                    Try Bulk Upload <MdOutlineFileUpload size={20} />
                                </Button>
                            </Upload>
                            <Button variant="link" className="h-12" onClick={handleDownloadTemplate}>
                                Download Excel Template
                            </Button>
                        </div>
                        <Button disabled={handleDisabled()} variant="text" type="primary" className="h-12" onClick={handleAddQuestion}>
                            {questionId ? "Update Question" : "Add Question"}
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