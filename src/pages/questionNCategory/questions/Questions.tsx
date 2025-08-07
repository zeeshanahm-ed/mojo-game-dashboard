//icons
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';
import AddRoundedIcon from 'assets/icons/add-rounded-icon.svg?react';
//componets
import { Button, Pagination, Popconfirm } from "antd";


const tableHeaders = [
    { title: 'Question', key: 'question', className: "text-start" },
    { title: 'Category / Subject  Assigned', key: 'categorySubjectAssigned', },
    { title: 'Difficulty', key: 'difficulty', },
    { title: 'Action', key: 'action', },
];


export interface Question {
    id: string;
    question: string;
    category: string;
    subject?: string;
    assigned?: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Static data matching your image
export const questionsData: Question[] = [
    {
        id: '1',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Medium'
    },
    {
        id: '2',
        question: 'Multiplication comes at which place in DMAS Rule ?',
        category: 'Mathematics',
        difficulty: 'Medium'
    },
    {
        id: '3',
        question: 'what is the name of the event of wrestling event name for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '4',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Easy'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '5',
        question: 'what is the name of the event of wrestling evname for summer ?',
        category: 'Wrestling',
        difficulty: 'Hard'
    },
    {
        id: '6',
        question: 'What is the largest country of the world ?',
        category: 'Geography',
        difficulty: 'Medium'
    }
];

function Questions() {

    const handleAddNewCat = () => {
        // Add new alert logic here
    };
    const handlePageChange = () => {
        // Add new alert logic here
    };
    const handleEditClick = (data: Question) => {
        // Add new alert logic here
    };
    const handleDeleteClick = (data: Question) => {
        // Add new alert logic here
    };


    return (
        <section className="overflow-hidden mb-10">
            <div className="flex justify-between items-center mt-10 flex-wrap gap-6">
                <div>
                    <Button
                        variant='text'
                        onClick={handleAddNewCat}
                        className='border border-primary bg-primary text-white font-normal shadow-none h-11 px-5 gap-6 text-sm w-fit'>
                        <AddRoundedIcon className="fill-white text-white" />  Add New
                    </Button>
                </div>
            </div>
            <div className="border border-gray-200 rounded-lg mt-5">
                {/* Table Title */}
                <div className="text-xl bg-black text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                    Showing all Questions
                    <span className="text-border-gray text-sm ml-2">{questionsData.length} Results</span>
                </div>

                <div className="w-full overflow-x-auto overflow-y-auto lg:max-h-[800px]">
                    <table className="min-w-[1092px] w-full">
                        {/* Table Header */}
                        <thead className="bg-light-gray text-white">
                            <tr>
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
                            {questionsData?.length > 0 ? (
                                questionsData.map((question, index) => (
                                    <tr
                                        key={index}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-5 text-starts">{question?.question}</td>
                                        <td className="p-5 text-center">{question?.category}</td>
                                        <td className="p-5 text-center">{question?.difficulty}</td>
                                        <td className="p-5">
                                            <div className="flex justify-center items-center gap-4">
                                                <Button variant="text" onClick={() => handleEditClick(question)} className="border-none shadow-none">
                                                    <EditIcon className="text-black" />
                                                </Button>
                                                <Popconfirm
                                                    title="Are you sure to delete this category?"
                                                    onConfirm={() => handleDeleteClick(question)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <DeleteIcon className="cursor-pointer text-error-500" />
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-5 text-center text-gray-500"
                                    >
                                        Categories Not Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <Pagination
                    current={1}
                    pageSize={10}
                    total={10}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>
        </section>
    )
}

export default Questions;