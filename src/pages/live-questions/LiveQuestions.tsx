import { useEffect, useState } from 'react';
import { Button, Empty, Pagination, Tooltip } from 'antd';
//Hooks

import { getCurrentLanguage } from 'helpers/CustomHelpers';
//icons
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import { useHeaderProps } from 'components/core/use-header-props';
import useGetAllQuestionsData from 'pages/questionNCategory/questions/hooks/useGetAllQuestionsData';
import { AllQuestionParams } from 'pages/questionNCategory/questions/core/_modals';
import LiveQuestionsDetailModal from 'components/modals/LiveQuestionsDetailModal';

const QuestionsReview = () => {
    const currentLang = getCurrentLanguage();
    const [params, setParams] = useState<AllQuestionParams>({
        page: 1,
        limit: 10,
        lang: currentLang,
    });

    const { questionsData, pagination, isLoading, refetch } = useGetAllQuestionsData(params);


    const [isQuestionReviewModalOpen, setIsQuestionReviewModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

    // Table headers configuration
    const tableHeaders = [
        // { title: 'User ID', key: 'userId', className: "text-start" },
        // { title: 'User Name', key: 'userName', className: "text-start" },
        { title: 'Question', key: 'question', className: "text-start" },
        { title: 'Category', key: 'category', className: "text-start" },
        { title: 'Action', key: 'action', className: "text-start" },
    ];

    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };


    const handleReviewQuestion = (question: any) => {
        setSelectedQuestion(question);
        setIsQuestionReviewModalOpen(true);
    };

    const handleCloseQuestionReview = () => {
        setIsQuestionReviewModalOpen(false);
        setSelectedQuestion(null);
    };

    // Custom table component
    const CustomTable = () => (
        <div className="min-w-[1100px]">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b">
                        {tableHeaders.map((header) => (
                            <th key={header.key} className={`p-4 font-medium text-gray-700 ${header.className || 'text-left'}`}>
                                {header.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {questionsData?.map((record: any) => (
                        <tr key={record._id} className="border-b hover:bg-gray-50 transition-colors">
                            {/* <Tooltip title={record?.suggestedById}>
                                <td className="p-4  truncate max-w-[80px]">
                                    {record?.suggestedById}
                                </td>
                            </Tooltip>
                            <td className="p-4">
                                <span className="text-gray-700">{record?.suggestedByName}</span>

                            </td> */}
                            <td className="p-4">
                                <span className="text-gray-700">{record.questionText || "-"}</span>
                            </td>
                            <td className="p-4">
                                <span className="text-gray-700">{record.category?.name || "-"}</span>
                            </td>
                            <td className="p-4">
                                <Button
                                    type="primary"
                                    onClick={() => handleReviewQuestion(record)}
                                    className='h-10'
                                >
                                    See Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <section className='mt-5'>
            <div className='border rounded-lg'>
                {/* Table Section */}
                <div className=" w-full overflow-x-auto overflow-hidden">
                    {isLoading ?
                        <FallbackLoader />
                        :
                        <>
                            {questionsData?.length > 0 ?
                                <CustomTable />
                                :
                                <Empty description="Data Not Found" />
                            }
                        </>
                    }
                </div>
            </div>


            {questionsData?.length > 0 && <Pagination
                className="mt-5 justify-center text-white"
                current={params?.page}
                pageSize={params?.limit}
                total={pagination?.total}
                onChange={handlePageChange}
                showSizeChanger={false}
            />}

            {/* Question Review Modal */}
            {selectedQuestion && (
                <LiveQuestionsDetailModal
                    open={isQuestionReviewModalOpen}
                    onClose={handleCloseQuestionReview}
                    questionData={selectedQuestion}
                    currentLanguage={currentLang}
                    getReviewQuestionData={refetch}
                />
            )}
        </section>
    );
};

function LiveQuestions() {
    const { setTitle } = useHeaderProps();


    useEffect(() => setTitle('Live Questions'), [setTitle]);

    return (
        <section>
            <QuestionsReview />
        </section>
    )
}

export default LiveQuestions;