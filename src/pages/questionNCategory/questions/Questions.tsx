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
import { getCurrentLanguage } from 'helpers/CustomHelpers';
import { useGetAllCategoriesDataForDropDownFromStore } from 'store/AllCategoriesData';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
//Components
import { Button, Empty, Pagination, Popconfirm, Select } from "antd";
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import AddNEditQuestionModal from 'components/modals/AddNEditQuestionModal';
import { getDownloadAllQuestions } from './core/_request';

interface StateType {
    selectedCategory: string | null;
    selectedDifficulty: string | null;
    categoriesOptions: { value: string; label: string }[];
}

const tableHeaders = [
    { title: 'Question', key: 'question', className: "text-start" },
    { title: 'Category Assigned', key: 'categorySubjectAssigned', },
    { title: 'Difficulty', key: 'difficulty', },
    { title: 'Action', key: 'action', },
];

const DifficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
];

function Questions() {
    const currentLang = getCurrentLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [params, setParams] = useState<AllQuestionParams>({
        page: 1,
        limit: 10,
        lang: currentLang,
        status: "Live"
    });
    const [editQuestionId, setEditQuestionId] = useState<string | null>(null);

    const { questionsData, pagination, isLoading, refetch } = useGetAllQuestionsData(params);
    const { deleteQuestionMutate } = useDeleteQuestion();
    const { categoriesData } = useGetAllCategoriesDataForDropDownFromStore();
    const [state, setState] = useState<StateType>({
        selectedCategory: null,
        selectedDifficulty: null,
        categoriesOptions: [],
    });

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
                showSuccessMessage('Question deleted successfully.');
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


    return (
        <section className="overflow-hidden mb-10">
            <div className="flex items-center mt-10 flex-wrap gap-6">
                <div>
                    <Button
                        variant='text'
                        onClick={handleAddNewQuestion}
                        className='border border-primary bg-primary text-white font-normal shadow-none h-12 px-5 gap-6 text-sm w-fit'>
                        <AddRoundedIcon className="fill-white text-white" />  Add New
                    </Button>
                </div>
                <Select
                    allowClear
                    options={DifficultyOptions}
                    value={state.selectedDifficulty || undefined}
                    placeholder="Difficulty"
                    className='h-12 w-48'
                    onChange={(value) => handleSelectChange(value, "selectedDifficulty")}
                />
                <Select
                    allowClear
                    options={state.categoriesOptions}
                    value={state.selectedCategory || undefined}
                    placeholder="Category"
                    className="h-12 w-48"
                    onChange={(value) => handleSelectChange(value, "selectedCategory")}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    // onPopupScroll={handlePopupScroll}
                    optionRender={(option) => (
                        <div key={option.data.value}>
                            <span>{option.data.label}</span>
                        </div>
                    )}
                />
                <Button
                    type="text"
                    className="bg-black text-white h-12 w-fit ml-auto"
                    onClick={() => handleDownloadAllQuestions()}
                    icon={<DownloadIcon className="w-5 h-5 mr-2" />}
                >
                    Download all questions
                </Button>
            </div>

            <div className="border border-gray-200 rounded-lg mt-5">
                {/* Table Title */}
                <div className="text-xl bg-black text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                    Showing all Questions
                    {pagination?.total > 0 && <span className="text-border-gray text-sm ml-2">{pagination?.total} Results</span>}
                </div>

                <div className="w-full overflow-x-auto overflow-y-auto h-[800px] lg:max-h-[800px]">
                    {isLoading ?
                        <FallbackLoader />
                        :
                        <>
                            {questionsData?.length === 0 ?
                                <Empty className="my-12" description="Questions not Found" />
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
                                                    {header.title}
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
                                                <td className="p-5 text-center">{question?.category?.name || '-'}</td>
                                                <td className="p-5 text-center capitalize">{question?.difficulty || '-'}</td>
                                                <td className="p-5 flex justify-center">
                                                    <div className="flex justify-center items-center gap-4">
                                                        <Button variant="text" onClick={() => handleEditClick(question?._id)} className="border-none shadow-none">
                                                            <EditIcon className="text-black" />
                                                        </Button>
                                                        <Popconfirm
                                                            title="Are you sure to delete this question?"
                                                            onConfirm={() => handleDeleteClick(question)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <Button variant="text" className="border-none shadow-none">
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

            <Pagination
                className="mt-5 justify-center text-white"
                current={params?.page}
                pageSize={pagination?.limit}
                total={pagination?.total}
                onChange={handlePageChange}
                showSizeChanger={false}
            />

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



