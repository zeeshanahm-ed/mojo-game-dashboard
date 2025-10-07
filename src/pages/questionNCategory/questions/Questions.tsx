import { useEffect, useState } from 'react';
//Icons
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon.svg?react';
import AddRoundedIcon from 'assets/icons/add-rounded-icon.svg?react';
import DownloadIcon from 'assets/icons/download-icon.svg?react';
//Hooks & Utils
import useDeleteQuestion from './hooks/useDeleteQuestion';
import useGetAllQuestionsData from './hooks/useGetAllQuestionsData';
import { AllQuestionParams } from './core/_modals';
import { getCurrentLanguage, hasPermission } from 'helpers/CustomHelpers';
import { useGetAllCategoriesDataForDropDownFromStore } from 'store/AllCategoriesData';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
//Components
import { Button, Empty, Pagination, Popconfirm, Select } from "antd";
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import AddNEditQuestionModal from 'components/modals/AddNEditQuestionModal';
import { getDownloadAllQuestions } from './core/_request';
import { getUser } from 'auth';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';
import useChangeCategoryStatus from '../categories/core/hooks/useChangeCategoryStatuc';
import useChangeQuestionStatus from './hooks/useChaneQuestionStatus';
// Removed custom virtualized select; using AntD Select with built-in virtualization

interface StateType {
    selectedCategory: string | null;
    selectedDifficulty: string | null;
    categoriesOptions: { value: string; label: string }[];
    selectedCategoryStatus: string | null;
    selectedQuestionStatus: string | null;
    selectedQuestionType: string | null;
}

function Questions() {
    const { t } = useTranslation();
    const direction = useDirection();
    const CURRENT_USER = getUser();
    const currentLang = getCurrentLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [params, setParams] = useState<AllQuestionParams>({
        page: 1,
        limit: 10,
        lang: currentLang,
    });
    const [editQuestionId, setEditQuestionId] = useState<string | null>(null);

    const { questionsData, pagination, isLoading, refetch } = useGetAllQuestionsData(params);
    const { changeCategoryStatusMutate } = useChangeCategoryStatus();
    const { changeQuestionStatusMutate } = useChangeQuestionStatus();
    const { deleteQuestionMutate } = useDeleteQuestion();
    const { categoriesData } = useGetAllCategoriesDataForDropDownFromStore();
    const [state, setState] = useState<StateType>({
        selectedCategory: null,
        selectedDifficulty: null,
        categoriesOptions: [],
        selectedCategoryStatus: null,
        selectedQuestionStatus: null,
        selectedQuestionType: null,
    });

    useEffect(() => {
        setParams(prev => ({ ...prev, lang: currentLang }));
    }, [direction, currentLang]);

    useEffect(() => {
        if (categoriesData?.length) {
            setState(prev => ({
                ...prev,
                categoriesOptions: categoriesData.map((cat: any) => ({ value: cat.id, label: cat.name })),
            }));
        }
    }, [categoriesData]);

    const handleSelectChange = (value: string | undefined, name: string) => {
        setState(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === "selectedCategory") {
            setParams(prev => ({ ...prev, page: 1, categoryId: value }));
        } else if (name === "selectedDifficulty") {
            setParams(prev => ({ ...prev, page: 1, difficulty: value }));
        } else if (name === "selectedCategoryStatus") {
            setParams(prev => ({ ...prev, page: 1, categoryStatus: value }));
        } else if (name === "selectedQuestionStatus") {
            setParams(prev => ({ ...prev, page: 1, status: value }));
        } else if (name === "selectedQuestionType") {
            setParams(prev => ({ ...prev, page: 1, questionType: value }));
        }
    };

    const handleAddNewQuestion = () => {
        setIsModalOpen(true);
    };
    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };
    const handleEditClick = (id: string) => {
        setIsModalOpen(true);
        setEditQuestionId(id);
    };
    const handleDeleteClick = (data: any) => {
        let id = data?._id;
        deleteQuestionMutate(id, {
            onSuccess: () => {
                showSuccessMessage(t('Question deleted successfully'));
                refetch();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },
        });
    };

    const handleDownloadAllQuestions = async () => {
        try {
            const response = await getDownloadAllQuestions();

            // Create a blob link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            // ✅ try to read filename from header if backend sends it
            const contentDisposition = response.headers["content-disposition"];
            let fileName = "questions-export.xlsx";
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

    const handleCategoryStatusChange = (status: string, category: any) => {
        changeCategoryStatusMutate(
            { id: category?._id, params: { status: status } },
            {
                onSuccess: (res: any) => {
                    showSuccessMessage(res?.message);
                    refetch();
                },
                onError: (error: any) => {
                    showErrorMessage(error?.response?.data?.message);
                },
            }
        );
    };
    const handleQuestionStatusChange = (status: string, category: any) => {
        changeQuestionStatusMutate(
            { id: category?._id, params: { status: status } },
            {
                onSuccess: (res: any) => {
                    showSuccessMessage(res?.message);
                    refetch();
                },
                onError: (error: any) => {
                    showErrorMessage(error?.response?.data?.message);
                },
            }
        );
    };

    const tableHeaders = [
        { title: 'Question', key: 'question', className: "text-start" },
        { title: 'Question Status', key: 'questionStatus', className: "text-center" },
        { title: 'Category Assigned', key: 'categorySubjectAssigned', },
        { title: 'Category Status', key: 'categoryStatus', className: "text-center" },
        { title: 'Difficulty', key: 'difficulty', },
        { title: 'Action', key: 'action', },
    ];

    const DifficultyOptions = [
        { value: 'easy', label: t('easy') },
        { value: 'medium', label: t('medium') },
        { value: 'hard', label: t('hard') },
    ];
    const statusOptions = [
        { value: "Active", label: t("Active") },
        { value: "Inactive", label: t("Inactive") },
        { value: "Pending", label: t("Pending") },
        { value: "Rejected", label: t("Rejected") },
    ];

    const questionStatusOptions = [
        { value: "Pending", label: t("Pending") },
        { value: "Under Review", label: t("Under Review") },
        { value: "Approved", label: t("Approved") },
        { value: "Rejected", label: t("Rejected") },
        { value: "Ambiguous", label: t("Ambiguous") },
        { value: "Live", label: t("Live") },
    ];

    const QuestionTypeOptions = [
        { value: 'Direct Answer', label: t('Simple Question') },
        { value: 'MCQs', label: t("MCQ's Question") },
    ];

    return (
        <section className="overflow-hidden mb-10">
            <div className="flex mt-10 flex-wrap gap-x-5 gap-y-5">
                <div className="flex items-center gap-5">
                    <Button
                        disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                        variant='text'
                        onClick={handleAddNewQuestion}
                        className={`border border-primary bg-primary text-white font-normal shadow-none h-12 px-5 gap-6 w-fit`}>
                        <AddRoundedIcon className="fill-white text-white" />  {t("Add New")}
                    </Button>
                    <Button
                        variant='text'
                        className={`bg-black text-white h-12 w-fit ml-auto`}
                        onClick={() => handleDownloadAllQuestions()}
                        icon={<DownloadIcon className="w-5 h-5 mr-2" />}
                    >
                        {t("Download all questions")}
                    </Button>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <Select
                        allowClear
                        options={DifficultyOptions}
                        value={state.selectedDifficulty || undefined}
                        placeholder={t("Difficulty")}
                        className={`h-12 w-48 select-ellipsis`}
                        onChange={(value) => handleSelectChange(value, "selectedDifficulty")}
                        optionRender={(option) => (
                            <div key={option.label as string}>
                                <span title={option.label as string} className={`text-base truncate block ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.label}</span>
                            </div>
                        )}
                    />
                    <Select
                        virtual
                        labelInValue
                        allowClear
                        options={state.categoriesOptions}
                        value={state.selectedCategory || undefined}
                        placeholder={t("Category")}
                        className={`h-12 w-48 select-ellipsis`}
                        onChange={(value) => handleSelectChange(value ? String(value) : undefined, "selectedCategory")}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        optionRender={(option) => (
                            <div key={option.data.value}>
                                <span title={option.data.label as string} className={`text-base truncate block ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.data.label}</span>
                            </div>
                        )}
                    />
                    <Select
                        allowClear
                        options={statusOptions}
                        value={state.selectedCategoryStatus || undefined}
                        placeholder={t("Category Status")}
                        className={`h-12 w-48 select-ellipsis`}
                        onChange={(value) => handleSelectChange(value, "selectedCategoryStatus")}
                        optionRender={(option) => (
                            <div key={option.label as string}>
                                <span title={option.label as string} className={`text-base truncate block ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.label}</span>
                            </div>
                        )}
                    />
                    <Select
                        allowClear
                        options={questionStatusOptions}
                        value={state.selectedQuestionStatus || undefined}
                        placeholder={t("Question Status")}
                        className={`h-12 w-48 select-ellipsis`}
                        onChange={(value) => handleSelectChange(value, "selectedQuestionStatus")}
                        optionRender={(option) => (
                            <div key={option.label as string}>
                                <span title={option.label as string} className={`text-base truncate block ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.label}</span>
                            </div>
                        )}
                    />
                    <Select
                        allowClear
                        options={QuestionTypeOptions}
                        value={state.selectedQuestionType || undefined}
                        placeholder={t("Question Type")}
                        className={`h-12 w-48 select-ellipsis`}
                        onChange={(value) => handleSelectChange(value, "selectedQuestionType")}
                        optionRender={(option) => (
                            <div key={option.label as string}>
                                <span title={option.label as string} className={`text-base truncate block ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.label}</span>
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg mt-5">
                {/* Table Title */}
                <div className="text-xl bg-black text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                    {t("Showing all Questions")}
                    {pagination?.total > 0 && <span className="text-border-gray text-sm me-2">{pagination?.total} {t("Results")}</span>}
                </div>

                <div className="w-full overflow-x-auto overflow-hidden h-[790px] lg:max-h-[790px]">
                    {isLoading ?
                        <FallbackLoader />
                        :
                        <>
                            {questionsData?.length === 0 ?
                                <Empty className={`my-12 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`} description={t("Questions not Found")} />
                                :
                                <table className="min-w-[1092px] w-full">
                                    {/* Table Header */}
                                    <thead className="bg-light-gray text-white">
                                        <tr className='border border-gray-200'>
                                            {tableHeaders.map((header) => (
                                                <th
                                                    key={header.key}
                                                    className={`${header?.className} p-5 font-normal text-center text-medium-gray whitespace-nowrap`}
                                                >
                                                    {t(header.title)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    {/* Table Body */}
                                    <tbody>
                                        {questionsData?.map((question: any, index: number) => (
                                            <tr
                                                key={index}
                                                className="border border-gray-200 hover:bg-gray-50 text-center last:border-none"
                                            >
                                                <td className="p-5 text-start">{question?.questionText || '-'}</td>
                                                <td className="p-5 text-center">
                                                    <Select
                                                        className={`w-44 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
                                                        value={t(question?.status as string)}
                                                        variant="borderless"
                                                        onChange={(e) => handleQuestionStatusChange(e, question)}
                                                        options={questionStatusOptions}
                                                        disabled={!question?._id}
                                                        optionRender={(option) => (
                                                            <div key={option.label as string}>
                                                                <span className={`text-base ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.label}</span>
                                                            </div>
                                                        )}
                                                    />
                                                </td>
                                                <td className="p-5 text-center">{question?.category?.name || '-'}</td>
                                                <td className="p-5 text-center">
                                                    <Select
                                                        className={`w-44 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
                                                        value={t(question?.category.status as string)}
                                                        variant="borderless"
                                                        onChange={(e) => handleCategoryStatusChange(e, question.category)}
                                                        options={statusOptions}
                                                        disabled={!question?.category._id}
                                                        optionRender={(option) => (
                                                            <div key={option.label as string}>
                                                                <span className={`text-base ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>{option.label}</span>
                                                            </div>
                                                        )}
                                                    />
                                                </td>
                                                <td className="p-5 text-center">{t(question?.difficulty as string) || '-'}</td>
                                                <td className="p-5 flex justify-center">
                                                    <div className="flex justify-center items-center gap-4">
                                                        <Button variant="text" disabled={hasPermission(CURRENT_USER?.role, "read_only")} onClick={() => handleEditClick(question?._id)} className="border-none shadow-none">
                                                            <EditIcon className="text-black" />
                                                        </Button>
                                                        <Popconfirm
                                                            disabled={hasPermission(CURRENT_USER?.role, "read_only")}
                                                            title={t("Are you sure to delete this question?")}
                                                            onConfirm={() => handleDeleteClick(question)}
                                                            okText={t("Yes")}
                                                            cancelText={t("No")}
                                                        >
                                                            <Button disabled={hasPermission(CURRENT_USER?.role, "read_only")} variant="text" className="border-none shadow-none">
                                                                <DeleteIcon className="text-error-500" />
                                                            </Button>
                                                        </Popconfirm>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }
                        </>
                    }
                </div>
            </div>
            {/* Pagination */}

            {questionsData?.length > 0 && <Pagination
                className="mt-5 justify-center text-white"
                current={params?.page}
                pageSize={pagination?.limit}
                total={pagination?.total}
                onChange={handlePageChange}
                showSizeChanger={false}
            />}

            {isModalOpen && <AddNEditQuestionModal
                open={isModalOpen}
                questionId={editQuestionId || ''}
                getAddedQuestionData={() => refetch()}
                onClose={() => { setIsModalOpen(false); setEditQuestionId(null); }}
            />}
        </section>
    )
}

export default Questions;



