import { useState } from "react";
import { Button, Pagination, } from "antd";

//icons
import AddRoundedIcon from 'assets/icons/add-rounded-icon.svg?react';
import CustomTabel from "./components/CustomTabel";

interface Category {
    id: number;
    name: string;
    type: string;
    section: string;
};

interface Subject {
    id: number;
    name: string;
    section: string;
    subjectSemester: string;
    academicLevel: string;
};

const CATEGORY_TABLE_HEADERS = [
    { title: 'Category Name', key: 'categoryName', },
    { title: 'Category Type', key: 'categoryType', },
    { title: 'Section', key: 'section', },
    { title: 'Action', key: 'action', },
];
const SUBJECT_TABLE_HEADERS = [
    { title: 'Subject Name', key: 'subjectName', },
    { title: 'Subject Semester', key: 'subjectSemester', },
    { title: 'Academic Level', key: 'academicLevel', },
    { title: 'Section', key: 'section', },
    { title: 'Action', key: 'action', },
];

const staticCategories: Category[] = [
    {
        id: 1,
        name: "Football",
        type: "Sports",
        section: "General Section",
    },
    {
        id: 2,
        name: "Wrestling",
        type: "Sports",
        section: "General Section",
    },
    {
        id: 3,
        name: "Mathematics",
        type: "Educational",
        section: "Kids Section",
    },
    {
        id: 4,
        name: "Football",
        type: "Sports",
        section: "Kids Section",
    },
    {
        id: 5,
        name: "English",
        type: "Educational",
        section: "Kids Section",
    },
    {
        id: 6,
        name: "Football",
        type: "Sports",
        section: "General Section",
    },
];

const staticSubjects: Subject[] = [
    {
        id: 1,
        name: "Football",
        section: "General Section",
        subjectSemester: "1st Semester",
        academicLevel: "Grade 1",
    },
    {
        id: 2,
        name: "Wrestling",
        section: "General Section",
        subjectSemester: "1st Semester",
        academicLevel: "Grade 1",
    },
    {
        id: 3,
        name: "Mathematics",
        section: "Kids Section",
        subjectSemester: "2nd Semester",
        academicLevel: "Grade 2",
    },
    {
        id: 4,
        name: "Football",
        section: "Kids Section",
        subjectSemester: "2nd Semester",
        academicLevel: "Grade 2",
    },
    {
        id: 5,
        name: "English",
        section: "Kids Section",
        subjectSemester: "2nd Semester",
        academicLevel: "Grade 2",
    },
];



function Categories() {
    const [currentTab, setCurrentTab] = useState('Categories');

    const handleAddNewCat = () => {
        // Add new alert logic here
    };

    const handlePageChange = () => {
        // Add new alert logic here
    };

    const handleEditClick = (data: Category, currentTab: string) => {
        console.log('Edit Category:', data, currentTab);
    };

    const handleDeleteClick = (data: Category, currentTab: string) => {
        console.log('Delete Category:', data, currentTab);
    };

    const handleTabChange = (value: string) => {
        setCurrentTab(value);
    };

    return (
        <section className="overflow-hidden mb-10">
            <div className="mt-10">
                <Button
                    variant='text'
                    onClick={handleAddNewCat}
                    className='border border-primary bg-primary text-white font-normal shadow-none h-11 px-5 gap-6 text-sm w-fit'>
                    <AddRoundedIcon className="fill-white text-white" />  Add New
                </Button>
            </div>

            <CustomTabel
                title="Showing all Categories"
                tableHeaders={currentTab === "Subjects" ? SUBJECT_TABLE_HEADERS : CATEGORY_TABLE_HEADERS}
                data={currentTab === "Subjects" ? staticSubjects : staticCategories}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleTabChange={handleTabChange}
                isLoading={false}
                errorMessage={currentTab === "Subjects" ? "Categories Not Found" : "Categories Not Found"}
                deleteMessage={currentTab === "Subjects" ? "Are you sure to delete this subject?" : "Are you sure to delete this category?"}
                currentTab={currentTab}
            />

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

export default Categories;