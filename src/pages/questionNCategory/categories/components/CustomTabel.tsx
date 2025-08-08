import { Button, Popconfirm, Radio } from 'antd'
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import EditIcon from 'assets/icons/edit-icon-services.svg?react';

interface CustomTableProps {
    tableHeaders: any[];
    data: any[];
    handleEditClick: (data: any, currentTab: string) => void;
    handleDeleteClick: (data: any, currentTab: string) => void;
    isLoading: boolean;
    errorMessage: string;
    title: string;
    currentTab: string;
    deleteMessage: string;
    handleTabChange: (tab: string) => void;
}

function CustomTabel({ handleDeleteClick, handleEditClick, data, tableHeaders, isLoading, deleteMessage, title, handleTabChange, currentTab }: CustomTableProps) {
    return (
        <div className="border border-gray-200 rounded-lg mt-5">
            {/* Table Title */}
            <div className="flex justify-between text-xl bg-black text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
                <div>
                    {title}
                    <span className="text-border-gray text-sm ml-4">{data?.length} Results</span>
                </div>
                <div>
                    <Radio.Group
                        value={currentTab}
                        onChange={(e) => handleTabChange(e.target.value)}
                        className="flex items-center gap-2"
                    >
                        <Radio className='text-base text-white' value="Categories">Categories</Radio>
                        <Radio className='text-base text-white' value="Subjects">Subjects</Radio>
                    </Radio.Group>
                </div>
            </div>

            <div className="w-full overflow-x-auto overflow-y-auto h-[800px] lg:max-h-[800px]">
                <table className="min-w-[1092px] w-full">
                    {/* Table Header */}
                    <thead className="bg-light-gray text-white">
                        <tr>
                            {tableHeaders?.map((header) => (
                                <th
                                    key={header.key}
                                    className={`p-5 font-normal text-center text-medium-gray whitespace-nowrap`}
                                >
                                    {header.title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {data?.length > 0 ? (
                            data.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-t hover:bg-gray-50 text-center"
                                >
                                    <td className="p-5">{row?.name}</td>
                                    <td className="p-5">{row?.type || row?.subjectSemester}</td>
                                    {currentTab === "Subjects" && <td className="p-5">{row?.academicLevel}</td>}
                                    <td className="p-5">{row?.section}</td>
                                    <td className="p-5">
                                        <div className="flex justify-center items-center gap-4">
                                            <Button variant="text" onClick={() => handleEditClick(row, currentTab)} className="border-none shadow-none">
                                                <EditIcon className="text-black" />
                                            </Button>
                                            <Popconfirm
                                                title={deleteMessage}
                                                onConfirm={() => handleDeleteClick(row, currentTab)}
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
    )
}

export default CustomTabel