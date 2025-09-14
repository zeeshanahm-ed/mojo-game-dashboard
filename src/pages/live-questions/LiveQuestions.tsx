import { useEffect, useState } from 'react';
import { Button, Empty, Pagination, Tooltip } from 'antd';
//Hooks

import { getCurrentLanguage } from 'helpers/CustomHelpers';
//icons
import FallbackLoader from 'components/core-ui/fallback-loader/FallbackLoader';
import QuestionReviewModal from 'components/modals/QuestionReviewModal';
import { useHeaderProps } from 'components/core/use-header-props';
import useGetReviewedQuestions from 'pages/reviewed-questions/core/hooks/useGetReviewedQuestions';

const questionsDataTemp = [
    {
        "_id": "68c56aba0746b38d4c19df52",
        "type": "text",
        "questionType": "MCQs",
        "questionText": {
            "en": "What is the name of the summer wrestling event?",
            "ar": "ما اسم حدث المصارعة الصيفي؟"
        },
        "options": {
            "en": [
                "Summer Slam",
                "WrestleMania",
                "Royal Rumble",
                "Backlash"
            ],
            "ar": [
                "سمر سلام",
                "ريسل مانيا",
                "رويال رامبل",
                "باكلاش"
            ]
        },
        "correctAnswer": {
            "en": "Summer Slam",
            "ar": "سمر سلام"
        },
        "difficulty": "medium",
        "points": 10,
        "status": "Pending",
        "categoryId": "68c56ab90746b38d4c19df50",
        "categoryName": null,
        "suggestedById": "68999da6f4f6a499444c7f28",
        "suggestedByName": "Zeeeshan Ahmed",
        "questionId": "68c56aba0746b38d4c19df52",
        "reviews": []
    },
    {
        "_id": "68c56aba0746b38d4c19df53",
        "type": "text",
        "questionType": "Direct Answer",
        "questionText": {
            "en": "Who is the longest reigning WWE champion?",
            "ar": "من هو بطل WWE الأطول فترة؟"
        },
        "options": {
            "en": [],
            "ar": []
        },
        "correctAnswer": {
            "en": "Bruno Sammartino",
            "ar": "برونو سامارتينو"
        },
        "difficulty": "hard",
        "points": 25,
        "status": "Pending",
        "categoryId": "68c56ab90746b38d4c19df50",
        "categoryName": null,
        "suggestedById": "68999da6f4f6a499444c7f28",
        "suggestedByName": "Zeeeshan Ahmed",
        "questionId": "68c56aba0746b38d4c19df53",
        "reviews": []
    },
    {
        "_id": "68c56aba0746b38d4c19df54",
        "type": "text-and-media",
        "questionType": "Direct Answer",
        "questionText": {
            "en": "Who won the Summer Slam 2020 main event?",
            "ar": "من فاز في الحدث الرئيسي لسمر سلام 2020؟"
        },
        "mediaUrl": "https://example.com/summerslam2020.jpg",
        "answerMediaUrl": "https://example.com/summerslam2020.jpg",
        "options": {
            "en": [],
            "ar": []
        },
        "correctAnswer": {
            "en": "Roman Reigns",
            "ar": "رومان رينز"
        },
        "difficulty": "hard",
        "points": 20,
        "status": "Pending",
        "categoryId": "68c56ab90746b38d4c19df50",
        "categoryName": null,
        "suggestedById": "68999da6f4f6a499444c7f28",
        "suggestedByName": "Zeeeshan Ahmed",
        "questionId": "68c56aba0746b38d4c19df54",
        "reviews": []
    },
    {
        "_id": "68c56aba0746b38d4c19df55",
        "type": "text",
        "questionType": "MCQs",
        "questionText": {
            "en": "Which match type typically ends only by pinfall or submission?",
            "ar": "أي نوع من النزالات ينتهي عادة بالتثبيت أو الاستسلام فقط؟"
        },
        "options": {
            "en": [
                "Singles",
                "Royal Rumble",
                "Ladder",
                "Battle Royal"
            ],
            "ar": [
                "فردي",
                "رويال رامبل",
                "سلم",
                "باتل رويال"
            ]
        },
        "correctAnswer": {
            "en": "Singles",
            "ar": "فردي"
        },
        "difficulty": "easy",
        "points": 8,
        "status": "Pending",
        "categoryId": "68c56ab90746b38d4c19df50",
        "categoryName": null,
        "suggestedById": "68999da6f4f6a499444c7f28",
        "suggestedByName": "Zeeeshan Ahmed",
        "questionId": "68c56aba0746b38d4c19df55",
        "reviews": []
    },
    {
        "_id": "68c56aba0746b38d4c19df56",
        "type": "text-and-media",
        "questionType": "MCQs",
        "questionText": {
            "en": "Which of these is held annually in April?",
            "ar": "أي من هذه الأحداث يُعقد سنوياً في أبريل؟"
        },
        "mediaUrl": "https://example.com/wrestlemania.jpg",
        "options": {
            "en": [
                "Summer Slam",
                "WrestleMania",
                "Royal Rumble",
                "Backlash"
            ],
            "ar": [
                "سمر سلام",
                "ريسل مانيا",
                "رويال رامبل",
                "باكلاش"
            ]
        },
        "correctAnswer": {
            "en": "WrestleMania",
            "ar": "ريسل مانيا"
        },
        "difficulty": "medium",
        "points": 15,
        "status": "Pending",
        "categoryId": "68c56ab90746b38d4c19df50",
        "categoryName": null,
        "suggestedById": "68999da6f4f6a499444c7f28",
        "suggestedByName": "Zeeeshan Ahmed",
        "questionId": "68c56aba0746b38d4c19df56",
        "reviews": []
    },
    {
        "_id": "68c56aba0746b38d4c19df57",
        "type": "text",
        "questionType": "Direct Answer",
        "questionText": {
            "en": "What is the term for a scripted rivalry?",
            "ar": "ما المصطلح للمنافسة المُخططة؟"
        },
        "options": {
            "en": [],
            "ar": []
        },
        "correctAnswer": {
            "en": "Feud",
            "ar": "عداء"
        },
        "difficulty": "easy",
        "points": 10,
        "status": "Pending",
        "categoryId": "68c56ab90746b38d4c19df50",
        "categoryName": null,
        "suggestedById": "68999da6f4f6a499444c7f28",
        "suggestedByName": "Zeeeshan Ahmed",
        "questionId": "68c56aba0746b38d4c19df57",
        "reviews": []
    }
]

const QuestionsReview = () => {
    const currentLang = getCurrentLanguage();
    const [params, setParams] = useState({
        page: 1,
        limit: 10,
        status: "Live"
    });
    const { allReviewedsQuestionsData, pagination, isLoading, refetch } = useGetReviewedQuestions(params);


    const [isQuestionReviewModalOpen, setIsQuestionReviewModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

    // Table headers configuration
    const tableHeaders = [
        { title: 'User ID', key: 'userId', className: "text-start" },
        { title: 'User Name', key: 'userName', className: "text-start" },
        { title: 'Question', key: 'question', className: "text-start" },
        { title: 'Category', key: 'category', className: "text-start" },
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
                    {questionsDataTemp?.map((record: any) => (
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
                            <td className="p-4">
                                <span className="text-gray-700">{record.categoryName?.en || record.categoryName?.ar}</span>
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
                            {questionsDataTemp?.length > 0 ?
                                <CustomTable />
                                :
                                <Empty description="Data Not Found" />
                            }
                        </>
                    }
                </div>
            </div>


            {questionsDataTemp?.length > 0 && <Pagination
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
                    activeTab='Live'
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