import { useEffect, useState } from 'react';
import { Button, Empty, Pagination, Tooltip } from 'antd';
//Hooks

import { getCurrentLanguage } from 'helpers/CustomHelpers';
//icons
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import QuestionReviewModal from 'components/modals/QuestionReviewModal';
import TabSwitcher from 'components/core-ui/tab-switcher/TabSwitcher';
import useGetReviewedQuestions from './core/hooks/useGetReviewedQuestions';
import { useHeaderProps } from 'components/core/use-header-props';

const QuestionsReview = ({ title, subTitle, status }: any) => {
    const currentLang = getCurrentLanguage();
    const [params, setParams] = useState({
        page: 1,
        limit: 10,
    });
    const { allReviewedsQuestionsData, pagination, isLoading, refetch } = useGetReviewedQuestions(params);

    useEffect(() => {
        setParams(prev => ({ ...prev, status }))
    }, [status]);


    const [isQuestionReviewModalOpen, setIsQuestionReviewModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

    // Table headers configuration
    const tableHeaders = [
        { title: 'User ID', key: 'userId', className: "text-start" },
        { title: 'User Name', key: 'userName', className: "text-start" },
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
                    {allReviewedsQuestionsData?.map((record: any) => (
                        <tr key={record._id} className="border-b hover:bg-gray-50 transition-colors">
                            <Tooltip title={record?.suggestedById}>
                                <td className="p-4  truncate max-w-[80px]">
                                    {record?.suggestedById}
                                </td>
                            </Tooltip>
                            <td className="p-4">
                                <span className="text-gray-700">{record?.suggestedByName}</span>

                            </td>
                            <td className="p-4">
                                <span className="text-gray-700">{record.questionText?.en || record.questionText?.ar}</span>
                            </td>
                            <td className="p-4 text-center">
                                <span className="text-gray-700">{record.categoryName?.en || record.categoryName?.ar || "-"}</span>
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
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl text-gray-900 mb-2">
                    {title}
                </h1>
                <p className="text-gray-600 text-base">
                    {subTitle}
                </p>
            </div>

            <div className='border rounded-lg'>
                {/* Table Section */}
                <div className=" w-full overflow-x-auto overflow-hidden">
                    {isLoading ?
                        <FallbackLoader />
                        :
                        <>
                            {allReviewedsQuestionsData?.length > 0 ?
                                <CustomTable />
                                :
                                <Empty description="Data Not Found" />
                            }
                        </>
                    }
                </div>
            </div>


            {allReviewedsQuestionsData?.length > 0 && <Pagination
                className="mt-5 justify-center text-white"
                current={params?.page}
                pageSize={params?.limit}
                total={pagination?.total}
                onChange={handlePageChange}
                showSizeChanger={false}
            />}

            {/* Question Review Modal */}
            {selectedQuestion && (
                <QuestionReviewModal
                    open={isQuestionReviewModalOpen}
                    onClose={handleCloseQuestionReview}
                    questionData={selectedQuestion}
                    currentLanguage={currentLang}
                    getReviewQuestionData={refetch}
                    activeTab={status}
                />
            )}
        </section>
    );
};

function ReviewedQuestions() {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const { setTitle } = useHeaderProps();
    const tabs = [
        { label: "Right" },
        { label: "Wrong" },
        { label: "Ambiguous" },
    ];

    useEffect(() => setTitle('Reviewed Questions'), [setTitle]);

    const getUiContent = (currentTab: number) => {
        switch (currentTab) {
            case 0:
                return <QuestionsReview title="Approved Questions" status="Approved" subTitle="Questions that received 3 'Right' votes from reviewers." />
            case 1:
                return <QuestionsReview title={"Rejected Questions"} status="Rejected" subTitle="Questions marked as 'Wrong' by reviewers." />
            case 2:
                return <QuestionsReview title={"Ambiguous Questions"} status="Ambiguous" subTitle="Questions marked as 'Ambiguity' by reviewers, requiring clarification." />
            default:
                break;
        }
    }

    return (
        <section>
            <TabSwitcher selectedTab={selectedTab} onSelectTab={setSelectedTab} tabs={tabs} />
            {getUiContent(selectedTab)}
        </section>
    )
}

export default ReviewedQuestions;