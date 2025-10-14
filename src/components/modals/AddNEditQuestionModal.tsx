import { useEffect, useRef, useState } from "react";
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
import { formatFileSize, isYoutubeUrlCorrect, splitFileName } from "helpers/CustomHelpers";
import BulkUploadResultModal from 'components/modals/BulkUploadResultModal';
import { getDownloadBulkUploadTemplate, updateBulkQuestionData } from "pages/questionNCategory/questions/core/_request";
import { useDirection } from "hooks/useGetDirection";
import { useTranslation } from "react-i18next";
//icons
import UploadImageIcon from "assets/icons/image-icon.svg?react";
import VideoIcon from "assets/icons/video-icon.svg?react";
import AudioIcon from "assets/icons/audio-icon.svg?react";
import LinkIcon from "assets/icons/link-icon.svg?react";
import { LuCirclePlus } from "react-icons/lu";
// import ShuffleIcon from "assets/icons/shuffle-icon.svg?react";
import { MdArrowBack, MdDelete, MdDone, MdClose, MdOutlineFileUpload } from "react-icons/md";


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

const AddNEditQuestionModal = ({ open, onClose, getAddedQuestionData, questionId = null }: QuestionNAnswerProps) => {
    const { t } = useTranslation();
    const direction = useDirection();
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

    const [isYoutubeUrl, setIsYoutubeUrl] = useState(false);

    const [linkInput, setLinkInput] = useState({
        question: false,
        answer: false,
        answerLink: "",
        questionLink: "",
    });

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

    const [bulkUploadFileErrorData, setBulkUploadFileErrorData] = useState<{
        success: number;
        failed: number;
        errors: string[];
    } | null>(null);
    const [isBulkUploadResultModalOpen, setIsBulkUploadResultModalOpen] = useState(false);

    const questionFileInputRef = useRef<HTMLInputElement>(null);
    const triggerQuestionFileInput = (type: UploadedFileType) => {
        setUploadedFileType(type);
        if (!questionFileInputRef.current) return;

        if (type === "image" && questionFileInputRef.current) {
            questionFileInputRef.current.accept = ".jpg,.jpeg,.png,.gif,.webp,.svg";
        } else if (type === "video") {
            questionFileInputRef.current.accept = ".mp4,.webm,.ogg";
        } else if (type === "audio") {
            questionFileInputRef.current.accept = ".mp3,.wav,.ogg,.mpeg";
        }
        questionFileInputRef.current?.click();
    };

    const answerFileInputRef = useRef<HTMLInputElement>(null);
    const triggerAnswerFileInput = (type: UploadedFileType) => {
        setUploadedFileType(type);
        if (!answerFileInputRef.current) return;

        if (type === "image" && answerFileInputRef.current) {
            answerFileInputRef.current.accept = ".jpg,.jpeg,.png,.gif,.webp,.svg";
        } else if (type === "video") {
            answerFileInputRef.current.accept = ".mp4,.webm,.ogg";
        } else if (type === "audio") {
            answerFileInputRef.current.accept = ".mp3,.wav,.ogg,.mpeg";
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
                questionMedia: questionData?.mediaUrl || questionData?.questionYoutubeLink,
                answerMedia: questionData?.answerMediaUrl || questionData?.answerYoutubeLink,
            }));

            const questionMediaFileName = questionData?.mediaUrl ? splitFileName(questionData?.mediaUrl) : questionData?.questionYoutubeLink;
            const answerMediaFileName = questionData?.answerMediaUrl ? splitFileName(questionData?.answerMediaUrl) : questionData?.answerYoutubeLink;

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
                questionMediaObj: questionData?.mediaUrl || questionData?.questionYoutubeLink,
                answerMediaObj: questionData?.answerMediaUrl || questionData?.answerYoutubeLink,
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
        if (!file) {
            return { error: true, message: "Please select a file" };
        }

        const fileExt = file.type.split("/")[1] || file.name.split(".").pop();
        const fileSizeMB = formatFileSize(file.size);

        // File type and size limits configuration
        const fileConfig = {
            image: {
                allowedTypes: IMAGE_FILE_TYPES,
                maxSize: 20,
                typeName: "Image"
            },
            video: {
                allowedTypes: VIDEO_FILE_TYPES,
                maxSize: 30,
                typeName: "Video"
            },
            audio: {
                allowedTypes: AUDIO_FILE_TYPES,
                maxSize: 10,
                typeName: "Audio"
            }
        };

        const config = fileConfig[uploadedFileType as keyof typeof fileConfig];

        if (!config) {
            return { error: true, message: "Invalid file type selected" };
        }

        // Check file extension
        if (!config.allowedTypes.includes(`.${fileExt}`)) {
            return {
                error: true,
                message: `${config.typeName} file type must be valid format: ${config.allowedTypes.join(", ")}`
            };
        }

        // Check file size
        if (fileSizeMB > config.maxSize) {
            return {
                error: true,
                message: `${config.typeName} file size must be less than ${config.maxSize}MB`
            };
        }

        return { error: false, message: "" };
    };

    const handleQuestionNAnswerMedia = (event: any) => {
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
            setState(prev => ({
                ...prev,
                [`${name}Obj`]: file,
                [`${name}FileName`]: file.name
            }));

            handleCloseLinkInput(name === "questionMedia" ? "question" : "answer")

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

        // Reset the input value to allow re-uploading the same file
        if (name === "questionMedia" && questionFileInputRef.current) {
            questionFileInputRef.current.value = "";
        } else if (name === "answerMedia" && answerFileInputRef.current) {
            answerFileInputRef.current.value = "";
        }
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
            const emptyENOption = options.find(opt => !opt.english.trim());
            const emptyAROption = options.find(opt => !opt.english.trim());
            if (emptyENOption || emptyAROption) {
                setErrorState(prev => ({ ...prev, options: t("All options must be filled.") }));
                return;
            }

            // Check for duplicate options (case-insensitive, trimmed)
            const englishOptions = options.map(opt => opt.english.trim().toLowerCase());
            const hasDuplicate = englishOptions.some((opt, idx) => englishOptions.indexOf(opt) !== idx);
            if (hasDuplicate) {
                setErrorState(prev => ({ ...prev, options: t("Options must be unique.") }));
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
        safeAppend("questionText[en]", questionState?.questionAR);
        safeAppend("questionText[ar]", questionState?.questionAR);
        safeAppend("answerExplanation[en]", questionState?.answerAR);
        safeAppend("answerExplanation[ar]", questionState?.answerAR);
        safeAppend("difficulty", state.selectedDifficulty);

        const points = DifficultyOptions.find(difficulty => difficulty.value === state.selectedDifficulty)?.points;
        safeAppend("points", points !== undefined ? String(points) : "");

        if (state.mode === "online") {
            options.forEach((opt) => {
                safeAppend("options[en][]", opt.arabic);
                safeAppend("options[ar][]", opt.arabic);
            });

            safeAppend("correctAnswer[en]", state.selectedCorrectOption?.arabic);
            safeAppend("correctAnswer[ar]", state.selectedCorrectOption?.arabic);
        } else {
            if (state.questionMediaObj?.type && state.questionMediaObj?.size) {
                formData.append("media", state.questionMediaObj);
            } else {
                if (linkInput.questionLink) {
                    formData.append("questionYoutubeLink", linkInput.questionLink);
                }
            }
            if (state.answerMediaObj?.type && state.answerMediaObj?.size) {
                formData.append("answerMedia", state.answerMediaObj);
            } else {
                if (linkInput.answerLink) {
                    formData.append("answerYoutubeLink", linkInput.answerLink);
                }
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
                onError: (error: any) => {
                    showErrorMessage(error?.response?.data?.message);
                    console.error('Error:', error);
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
                onError: (error: any) => {
                    showErrorMessage(error?.response?.data?.message);
                    console.error('Error:', error);
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

    // const handleTranslate = (index: number) => {
    //     const updatedOptions = [...options];
    //     updatedOptions[index].arabic = "ترجمة: " + updatedOptions[index].english;
    //     setOptions(updatedOptions);
    //     setErrorState(prev => ({ ...prev, options: "" }));
    // };

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
            return !questionState?.questionAR || !questionState?.answerAR || !state.selectedCategory || !state.selectedDifficulty || !state.selectedCorrectOption;
        } else {
            return !questionState?.questionAR || !questionState?.answerAR || !state.selectedCategory || !state.selectedDifficulty || !state.questionMediaFileName || !state.answerMediaFileName;
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
            updateBulkQuestionData(formData).then((res) => {
                if (res.data.errors.length > 0) {
                    setBulkUploadFileErrorData(res.data);
                    setIsBulkUploadResultModalOpen(true);
                } else {
                    showSuccessMessage("Bulk questions uploaded successfully");
                }
            }).catch((error) => {
                showErrorMessage("Error uploading bulk questions");
                console.error("Error uploading bulk questions:", error);
            }).finally(() => {
                setUploadedFileLoading(false);
            });
        }
    };


    const DifficultyOptions = [
        { value: 'easy', label: t('easy'), points: 200 },
        { value: 'medium', label: t('medium'), points: 400 },
        { value: 'hard', label: t('hard'), points: 600 },
    ];

    const QuestionTypeOptions = [
        { value: 'Direct Answer', label: t('Simple Question') },
        { value: 'MCQs', label: t("MCQ's Question") },
    ];

    const handleShowLinkInput = (name: "question" | "answer") => {
        setLinkInput(prev => ({
            ...prev,
            [name]: true,
            [`${name}Link`]: questionState?.[`${name}Media`] || ""
        }));
    };

    const handleCloseLinkInput = (name: "question" | "answer") => {
        setIsYoutubeUrl(false);
        setLinkInput(prev => ({
            ...prev,
            [name]: false,
            [`${name}Link`]: ""
        }));
    };

    const handleDoneLinkInput = (name: "question" | "answer") => {
        if (linkInput[`${name}Link`] === "") {
            showErrorMessage(t("youtubeUrlIsRequired"));
            return;
        } else if (isYoutubeUrlCorrect(linkInput[`${name}Link`])) {
            setIsYoutubeUrl(true);
            setQuestionState((prevState) => {
                return {
                    ...prevState,
                    [`${name}Media`]: linkInput[`${name}Link`],
                } as any;
            });
            setLinkInput(prev => ({
                ...prev,
                [name]: false,
            }));
            setState(prev => ({
                ...prev,
                [`${name}MediaFileName`]: linkInput[`${name}Link`],
            }));
        } else {
            showErrorMessage(t("youtubeUrlNotCorrect"));
        }
    };

    return (
        <>
            <Modal
                open={open}
                onCancel={handleClose}
                footer={null}
                centered
                width={800}
                maskClosable={false}
                className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
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
                        <p className='font-normal text-2xl'>{t('Add New Question')}</p>
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
                                    <label className="text-base">{t('Assign Category')}</label>
                                    <Select
                                        virtual
                                        allowClear={false}
                                        options={state.categoriesOptions}
                                        onChange={(value) => handleSelectChange(value, "selectedCategory")}
                                        value={state.selectedCategory || undefined}
                                        placeholder={t('Assign Category')}
                                        className={`h-12 w-48`}
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                        }
                                        optionRender={(option) => (
                                            <div key={option.data.value}>
                                                <span className={`truncate text-base ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.data.label}</span>
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <label className="text-base">{t('Choose Difficulty')}</label>
                                    <Select
                                        allowClear={false}
                                        options={DifficultyOptions}
                                        placeholder={t('Choose Difficulty')}
                                        className={`h-12 w-48`}
                                        onChange={(value) => handleSelectChange(value, "selectedDifficulty")}
                                        value={t(state.selectedDifficulty as string) || undefined}
                                        optionRender={(option) => (
                                            <div key={option.label as string}>
                                                <span className={`text-base ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.label}</span>
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <label className="text-base">{t('Question Type')}</label>
                                    <Select
                                        allowClear={false}
                                        options={QuestionTypeOptions}
                                        onChange={(value) => handleSelectChange(value, "selectedQuestionType")}
                                        value={t(state.selectedQuestionType as string) || undefined}
                                        placeholder={t('Question Type')}
                                        className={`h-12 w-48`}
                                        optionRender={(option) => (
                                            <div key={option.label as string}>
                                                <span className={`text-base ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.label}</span>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className='space-y-5 overflow-y-auto h-auto max-h-[600px]'>
                                {/* Question */}
                                <div dir={direction}>
                                    <h2 className='w-full  text-lg mb-5 flex items-center gap-x-5'>{t('Add Question')} <span className='h-[2px] flex-1 bg-border-gray'></span></h2>
                                    <div className='space-y-5'>
                                        {/* <Input
                                            name='questionEN'
                                            type='text'
                                            placeholder={t('Question')}
                                            value={questionState?.questionEN}
                                            onChange={(e) => handleOnChange(e)}
                                            className="w-full px-4"
                                        /> */}
                                        <Input
                                            type='text'
                                            name='questionAR'
                                            dir={direction}
                                            placeholder={t('Question')}
                                            value={questionState?.questionAR}
                                            onChange={(e) => handleOnChange(e)}
                                            className="w-full px-4"
                                        />
                                        {linkInput.question && (
                                            <div className="relative mt-5">
                                                <div dir={direction} className='text-sm flex items-center gap-x-2 absolute top-[18px] md:end-5 end-2 z-10'>
                                                    <button onClick={() => handleDoneLinkInput("question")}>
                                                        <MdDone size={24} />
                                                    </button>
                                                    <button onClick={() => handleCloseLinkInput("question")}>
                                                        <MdClose size={24} />
                                                    </button>
                                                </div>
                                                <Input
                                                    dir={direction}
                                                    type='text'
                                                    name='questionLink'
                                                    placeholder={t("Youtube Video Link")}
                                                    value={linkInput.questionLink}
                                                    onChange={(e) => setLinkInput(prev => ({ ...prev, questionLink: e.target.value }))}
                                                    className="w-full border pe-20"
                                                />
                                            </div>
                                        )}
                                        <div className={`w-full flex-col gap-4 ${state.mode === 'online' ? 'hidden' : 'flex'}`}>
                                            <div className="relative w-full h-14 px-4 transform rounded-lg overflow-hidden border border-border-gray flex items-center justify-center">
                                                {/* Hidden file input */}
                                                <input
                                                    type="file"
                                                    ref={questionFileInputRef}
                                                    name="questionMedia"
                                                    onChange={handleQuestionNAnswerMedia}
                                                    className="hidden"
                                                />
                                                {questionState?.questionMedia ?
                                                    <>
                                                        <span className={`truncate  ${uploadedFileType === "image" ? "" : ""} mt-1`}>{state.questionMediaFileName}</span>
                                                        <button
                                                            className="ms-auto"
                                                            onClick={() => handleRemove("questionMedia")}
                                                        >
                                                            <MdDelete className="text-danger" size={24} />
                                                        </button>
                                                    </>
                                                    :

                                                    <div className="w-full h-full flex items-center justify-between gap-x-5 bg-white" >
                                                        <span className="border-e h-full pe-4 flex-centered border-border-gray text-center ">{t('Upload Media')}</span>
                                                        <div className='flex items-center justify-between flex-1 px-8'>
                                                            <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerQuestionFileInput("image")}>
                                                                <UploadImageIcon />
                                                                <span className="text-base ">{t('Image')}</span>
                                                            </button>
                                                            <Divider type="vertical" className="h-10" />
                                                            <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerQuestionFileInput("video")}>
                                                                <VideoIcon />
                                                                <span className="text-base ">{t('Video')}</span>
                                                            </button>
                                                            <Divider type="vertical" className="h-10" />
                                                            <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerQuestionFileInput("audio")}>
                                                                <AudioIcon />
                                                                <span className="text-base ">{t('Audio')}</span>
                                                            </button>
                                                            <Divider type="vertical" className="h-10" />
                                                            <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => handleShowLinkInput("question")}>
                                                                <LinkIcon />
                                                                <span className="text-base ">{t('Youtube Video Link')}</span>
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
                                <div dir={direction}>
                                    <h2 className='w-full text-lg mb-5 flex items-center gap-x-5'>{t('Add Answer Description')} <span className='h-[2px] flex-1 bg-border-gray'></span></h2>
                                    <div className='space-y-5'>
                                        {/* <Input
                                            name='answerEN'
                                            type='text'
                                            placeholder={t('Answer')}
                                            value={questionState?.answerEN}
                                            onChange={(e) => handleOnChange(e)}
                                            className="w-full px-4"
                                        /> */}
                                        <Input
                                            type='text'
                                            name='answerAR'
                                            dir={direction}
                                            placeholder={t('Answer')}
                                            value={questionState?.answerAR}
                                            onChange={(e) => handleOnChange(e)}
                                            className="w-full border px-4"
                                        />
                                        {linkInput.answer && (
                                            <div className="relative mt-5">
                                                <div dir={direction} className='text-sm flex items-center gap-x-2 absolute top-[18px] md:end-5 end-2 z-10'>
                                                    <button onClick={() => handleDoneLinkInput("answer")}>
                                                        <MdDone size={24} />
                                                    </button>
                                                    <button onClick={() => handleCloseLinkInput("answer")}>
                                                        <MdClose size={24} />
                                                    </button>
                                                </div>
                                                <Input
                                                    type='text'
                                                    dir={direction}
                                                    name='answerLink'
                                                    placeholder={t("Youtube Video Link")}
                                                    value={linkInput.answerLink}
                                                    onChange={(e) => setLinkInput(prev => ({ ...prev, answerLink: e.target.value }))}
                                                    className="w-full border pe-20"
                                                />
                                            </div>
                                        )}
                                        <div className={`w-full flex-col gap-4 ${state.mode === 'online' ? 'hidden' : 'flex'}`}>
                                            <div className="relative w-full h-14 px-4 rounded-lg transform overflow-hidden border border-border-gray flex items-center justify-center">
                                                {/* Hidden file input */}
                                                <input
                                                    type="file"
                                                    ref={answerFileInputRef}
                                                    name="answerMedia"
                                                    onChange={handleQuestionNAnswerMedia}
                                                    className="hidden"
                                                />
                                                {questionState?.answerMedia ?
                                                    <>
                                                        <span className={`truncate ${uploadedFileType === "image" ? "" : ""} mt-1`}>{state.answerMediaFileName}</span>
                                                        <button
                                                            className="ms-auto"
                                                            onClick={() => handleRemove("answerMedia")}
                                                        >
                                                            <MdDelete className="text-danger" size={24} />
                                                        </button>
                                                    </>

                                                    :

                                                    <div className="w-full h-full flex items-center justify-between gap-x-5 bg-white">
                                                        <span className="border-e h-full pe-4 flex-centered border-border-gray text-center ">{t('Upload Media')}</span>
                                                        <div className='flex items-center justify-between flex-1 px-8'>
                                                            <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerAnswerFileInput("image")}>
                                                                <UploadImageIcon />
                                                                <span className="text-base ">{t('Image')}</span>
                                                            </button>
                                                            <Divider type="vertical" className="h-10" />
                                                            <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerAnswerFileInput("video")}>
                                                                <VideoIcon />
                                                                <span className="text-base ">{t('Video')}</span>
                                                            </button>
                                                            <Divider type="vertical" className="h-10" />
                                                            <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => triggerAnswerFileInput("audio")}>
                                                                <AudioIcon />
                                                                <span className="text-base ">{t('Audio')}</span>
                                                            </button>
                                                            <Divider type="vertical" className="h-10" />
                                                            <button className='flex-centered gap-x-4  hover:text-medium-gray transition-colors duration-300' onClick={() => handleShowLinkInput("answer")}>
                                                                <LinkIcon />
                                                                <span className="text-base ">{t('Youtube Video Link')}</span>
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
                                    <div className="w-full" dir={direction}>
                                        <h2 className="w-full text-lg mb-5 flex items-center gap-x-5">{t("Add MCQ'S")} <span className="text-sm text-gray-500">{t("Select anyone with right answer")}</span></h2>

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
                                    <div key={index} className="space-y-1" dir={direction}>
                                        <p className="font-medium">{t("Option")} {index + 1}</p>

                                        <div className="flex items-center gap-3">
                                            {/* English Input */}
                                            <div className="flex flex-col flex-1">
                                                <Input
                                                    dir={direction}
                                                    placeholder={t("Type option")}
                                                    value={opt.english}
                                                    onChange={(e) => handleChange(index, "english", e.target.value)}
                                                    className="flex-1 h-14"
                                                />
                                                {/* <span className="text-xs text-gray-500 mt-1">{t("English")}</span> */}
                                            </div>

                                            {/* Shuffle Icon */}
                                            {/* <span className="flex-shrink-0 -mt-5">
                                                <ShuffleIcon />
                                            </span> */}

                                            {/* Translate Button */}
                                            {/* <div className="w-2/5 ">
                                                <button
                                                    onClick={() => handleTranslate(index)}
                                                    className="w-full h-12 rounded-lg border underline font-medium hover:no-underline"
                                                >
                                                    {opt.arabic ? opt.arabic : t("Translate")}
                                                </button>
                                                <span className="text-xs text-gray-500 mt-1">{t("Arabic")}</span>
                                            </div> */}
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
                                        {t('Try Bulk Upload')} <MdOutlineFileUpload size={20} />
                                    </Button>
                                </Upload>
                                <Button variant="link" className="h-12" onClick={handleDownloadTemplate}>
                                    {t('Download Excel Template')}
                                </Button>
                            </div>
                            <Button disabled={handleDisabled()} variant="text" type="primary" className="h-12" onClick={handleAddQuestion}>
                                {questionId ? t('Update Question') : t('Add Question')}
                            </Button>
                        </div> :
                        <div className='w-full flex items-center justify-end mt-5'>
                            <Button variant="text" type="primary" className="h-12" onClick={handleAddOptions}>
                                {t('Add Options')}
                            </Button>
                        </div>
                    }
                </div>
            </Modal >
            <BulkUploadResultModal
                open={isBulkUploadResultModalOpen}
                onClose={() => {
                    setIsBulkUploadResultModalOpen(false);
                    setBulkUploadFileErrorData(null);
                }}
                data={bulkUploadFileErrorData}
            />
        </>
    )
};

export default AddNEditQuestionModal;