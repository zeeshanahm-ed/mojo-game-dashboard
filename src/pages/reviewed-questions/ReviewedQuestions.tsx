import { useEffect, useState } from 'react';
import { Button, Empty, Pagination, Tooltip } from 'antd';
//Hooks

import { getCurrentLanguage } from 'helpers/CustomHelpers';
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import QuestionReviewModal from 'components/modals/QuestionReviewModal';
import TabSwitcher from 'components/core-ui/tab-switcher/TabSwitcher';
import useGetReviewedQuestions from './core/hooks/useGetReviewedQuestions';
import { useHeaderProps } from 'components/core/use-header-props';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';

const QuestionsReview = ({ title, subTitle, status }: any) => {
    const { t } = useTranslation();
    const direction = useDirection();
    const currentLang = getCurrentLanguage();
    const [params, setParams] = useState({
        page: 1,
        limit: 10,
        sortBy: "updatedAt",
        sortOrder: "desc",
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
    const getQuestionText = (questionData: any) => {
        return questionData?.questionText?.[currentLang] || questionData?.questionText?.ar || '';
    };
    const getCategoryName = (questionData: any) => {
        return questionData?.categoryName?.[currentLang] || questionData?.categoryName?.ar || null;
    };

    // Custom table component
    const CustomTable = () => (
        <div className="min-w-[1100px]">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b">
                        {tableHeaders.map((header) => (
                            <th key={header.key} className={`p-4 font-medium text-gray-700 ${header.className || 'text-left'}`}>
                                {t(header.title)}
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
                                <span className="text-gray-700">{getQuestionText(record)}</span>
                            </td>
                            <td className="p-4 text-start">
                                <span className="text-gray-700">{getCategoryName(record)}</span>
                            </td>
                            <td className="p-4">
                                <Button
                                    type="primary"
                                    onClick={() => handleReviewQuestion(record)}
                                    className={`h-10`}
                                >
                                    {t('See Details')}
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
                                <Empty className={`my-12 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`} description={t('Data Not Found')} />
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
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const { setTitle } = useHeaderProps();
    const tabs = [
        { label: t('Right') },
        { label: t('Wrong') },
        { label: t('Ambiguous') },
    ];

    useEffect(() => setTitle(t('Reviewed Questions')), [setTitle, t]);

    const getUiContent = (currentTab: number) => {
        switch (currentTab) {
            case 0:
                return <QuestionsReview title={t("Approved Questions")} status="Approved" subTitle={t("Questions that received 3 'Right' votes from reviewers")} />
            case 1:
                return <QuestionsReview title={t("Rejected Questions")} status="Rejected" subTitle={t("Questions marked as 'Wrong' by reviewers")} />
            case 2:
                return <QuestionsReview title={t("Ambiguous Questions")} status="Ambiguous" subTitle={t("Questions marked as 'Ambiguity' by reviewers, requiring clarification")} />
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