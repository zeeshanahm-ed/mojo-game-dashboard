//icons
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon.svg?react';
import AddRoundedIcon from 'assets/icons/add-rounded-icon.svg?react';
//componets
import { Button, Empty, Pagination, Popconfirm, Select } from "antd";
import useGetAllQuestionsData from './hooks/useGetAllQuestionsData';
import { AllQuestionParams } from './core/_modals';
import { useState } from 'react';
import { getCurrentLanguage } from 'helpers/CustomHelpers';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import useDeleteQuestion from './hooks/useDeleteQuestion';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import AddNEditQuestionModal from 'components/modals/AddNEditQuestionModal';


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
        status: 'Approved',
    });

    const { questionsData, pagination, isLoading, refetch } = useGetAllQuestionsData(params);
    const { deleteQuestionMutate } = useDeleteQuestion();

    const handleAddNewQuestion = () => {
        setIsModalOpen(true);
    };
    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };
    const handleEditClick = (data: any) => {
        // Add new alert logic here
    };
    const handleDeleteClick = (data: any) => {
        let id = data?._id;
        deleteQuestionMutate(id, {
            onSuccess: () => {
                showSuccessMessage('Question deleted successfully.');
                refetch();
            },
            onError: () => {
                showErrorMessage('An error occurred while deleting the question.');
            },
        });
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
                    placeholder="Difficulty"
                    className='h-12 w-48'
                />
                <Select
                    allowClear
                    options={DifficultyOptions}
                    placeholder="Category"
                    className='h-12 w-48'
                />
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
                                                <td className="p-5 text-center">{question?.difficulty || '-'}</td>
                                                <td className="p-5 flex justify-center">
                                                    <div className="flex justify-center items-center gap-4">
                                                        <Button variant="text" onClick={() => handleEditClick(question)} className="border-none shadow-none">
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

            <AddNEditQuestionModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    )
}

export default Questions;



