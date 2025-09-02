// import React, { useEffect, useState, useCallback } from "react";
// import { Input, Button, Spin, Empty, Pagination, Popconfirm, DatePicker, Slider } from "antd";
// import dayjs, { Dayjs } from "dayjs";
// //utils
// import { useHeaderProps } from "components/core/use-header-props";
// import { debounce } from "helpers/CustomHelpers";
// //icons
// import { SearchOutlined } from "@ant-design/icons";
// import DeleteIcon from 'assets/icons/delete-icon.svg?react';
// import DateIcon from 'assets/icons/date-icon.svg?react';
// import DownloadIcon from 'assets/icons/download-icon.svg?react';

// const { RangePicker } = DatePicker;

// const Table_Header = [
//     "Date",
//     "User",
//     "Transaction Amount",
//     "Type",
//     "Status",
//     "",
// ];


// // Transaction interface definition with strict typing
// interface Transaction {
//     dated: string;
//     user: string;
//     transactionAmount: string;
//     type: 'Wallet recharge' | 'game pack';
//     status: 'Successful' | 'Failed';
// }

// // Static data array
// const transactionsData: Transaction[] = [
//     {
//         dated: "10/12/2025",
//         user: "Muhammad Huzaifa",
//         transactionAmount: "25 Riyals",
//         type: "Wallet recharge",
//         status: "Successful"
//     },
//     {
//         dated: "10/12/2025",
//         user: "Bilal Muhammad",
//         transactionAmount: "25 Riyals",
//         type: "game pack",
//         status: "Successful"
//     },
//     {
//         dated: "10/12/2025",
//         user: "Tayyab karim",
//         transactionAmount: "25 Riyals",
//         type: "game pack",
//         status: "Successful"
//     },
//     {
//         dated: "10/12/2025",
//         user: "John anderson",
//         transactionAmount: "150 Riyals",
//         type: "Wallet recharge",
//         status: "Successful"
//     },
//     {
//         dated: "10/12/2025",
//         user: "Brad johnson",
//         transactionAmount: "25 Riyals",
//         type: "Wallet recharge",
//         status: "Successful"
//     },
//     {
//         dated: "10/12/2025",
//         user: "Abdullah Karim",
//         transactionAmount: "25 Riyals",
//         type: "game pack",
//         status: "Failed"
//     }
// ];

// interface DateRange {
//     startDate: Dayjs | null;
//     endDate: Dayjs | null;
// }

// export const PaymentTransactions: React.FC = () => {
//     const { setTitle } = useHeaderProps();
//     const [search, setSearch] = useState("");
//     const [params, setParams] = useState({
//         limit: 10,
//         page: 1,
//         role: "user",
//         status: "all"
//     });
//     const [dateRanges, setDateRange] = useState<DateRange>({
//         startDate: null,
//         endDate: null,
//     });
//     const step = 1
//     const [range, setRange] = useState<[number, number]>([0, 100]);

//     const handleSliderChange = (value: number | number[]) => {
//         if (Array.isArray(value)) {
//             setRange(value as [number, number]);
//             console.log('Selected range:', value[0], 'to', value[1]);
//         }
//     };


//     useEffect(() => setTitle('Payments & Transactions'), [setTitle]);

//     const debouncedOnChange = useCallback(
//         debounce((name: string) => {
//             setParams((prev) => ({ ...prev, name }));
//         }, 800),
//         []
//     );

//     const handlePageChange = (page: number) => {
//         setParams(prev => ({ ...prev, page }));
//     };
//     const handleDeleteTransaction = (transaction: Transaction) => {
//         // Implement delete logic here
//     };

//     const handleDateRangeChange = (date: any, setState: any) => {
//         if (!date?.length) {
//             setState({ startDate: "", endDate: "" });
//         } else {
//             setState((prev: any) => ({
//                 ...prev,
//                 startDate: date[0],
//                 endDate: date[1],
//             }));
//         }
//     };

//     return (
//         <section className="overflow-hidden my-10">
//             {/* Search and Filters */}
//             <div className="flex items-center gap-5 flex-wrap">
//                 <RangePicker
//                     prefix={<DateIcon className="w-6 h-6 mr-2" />}
//                     suffixIcon={null}
//                     className="px-2 h-12 w-80"
//                     value={[dateRanges.startDate, dateRanges.endDate]}
//                     onChange={(date) => handleDateRangeChange(date, setDateRange)}
//                     format="MM/DD/YYYY"
//                 />
//                 <Input
//                     placeholder="Search by name"
//                     prefix={<SearchOutlined className="mr-5" />}
//                     className="h-12 w-80"
//                     value={search}
//                     onChange={(e) => { setSearch(e.target.value); debouncedOnChange(e.target.value) }}
//                 />
//                 <div className="flex items-center gap-2 flex-1">
//                     <label className="font-medium text-nowrap">Amount Range</label>
//                     <div className="flex items-center">
//                         <span className="text-primary mr-1 text-center w-8 ">{range[0]}</span>
//                         <Slider
//                             range
//                             min={0}
//                             max={100}
//                             step={step}
//                             value={range}
//                             onChange={handleSliderChange}
//                             className="w-[350px]"
//                             trackStyle={[{ backgroundColor: '#1890ff', height: 6 }]}
//                         />
//                         <span className="text-primary ml-2 text-center w-8">{range[1]}</span>
//                     </div>
//                 </div>
//                 <Button
//                     type="text"
//                     className="bg-black text-white h-12 w-fit"
//                     onClick={() => {
//                         // Implement download logic here
//                     }}
//                     icon={<DownloadIcon className="w-5 h-5 mr-2" />}
//                 >

//                     Download all transactions
//                 </Button>
//             </div>

//             {/* Heading */}

//             {/* Custom Table */}
//             <div className="border border-gray-200  rounded-lg mt-5">
//                 <div className="text-xl bg-black text-white px-4 py-4 rounded-ss-lg rounded-se-lg">
//                     Showing user’s Transactions <span className="text-border-gray text-sm ml-2">{transactionsData.length} Results</span>
//                 </div>

//                 {/* Scroll Wrapper */}
//                 <div className="w-full overflow-x-auto overflow-y-auto h-[800px] lg:max-h-[800px]">
//                     {false ?
//                         <div className='flex justify-center items-center h-32'>
//                             <Spin size="large" />
//                         </div>
//                         :
//                         <>
//                             {transactionsData?.length === 0 ?
//                                 <Empty className="my-12" description="No Users Found" />
//                                 :
//                                 <table className="min-w-[1092px] w-full">
//                                     <thead className="bg-light-gray text-white">
//                                         <tr>
//                                             {Table_Header.map((header, index) => (
//                                                 <th
//                                                     key={index}
//                                                     className="p-5 font-normal text-left text-medium-gray whitespace-nowrap"
//                                                 >
//                                                     {header}
//                                                 </th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {transactionsData?.map((transaction: Transaction, index: number) => (
//                                             <tr key={index} className="border-t hover:bg-gray-50">
//                                                 <td className="p-5  truncate max-w-[160px]">{transaction.dated}</td>
//                                                 <td className="p-5"> {transaction.user}</td>
//                                                 <td className="p-5">{transaction.transactionAmount}</td>
//                                                 <td className="p-5">{transaction.type}</td>
//                                                 <td className={`p-5`}>{transaction.status}</td>
//                                                 <td className="p-5 text-xl cursor-pointer">
//                                                     <Popconfirm
//                                                         title="Are you sure to delete this transaction?"
//                                                         onConfirm={() => handleDeleteTransaction(transaction)}
//                                                         okText="Yes"
//                                                         cancelText="No"
//                                                     >
//                                                         <Button variant="text" className="border-none shadow-none">
//                                                             <DeleteIcon className="text-error-500" />
//                                                         </Button>
//                                                     </Popconfirm>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             }
//                         </>
//                     }
//                 </div>
//             </div>
//             {/* Pagination */}

//             <Pagination
//                 className="mt-5 justify-center text-white"
//                 current={params?.page}
//                 pageSize={10}
//                 total={transactionsData?.length}
//                 onChange={handlePageChange}
//                 itemRender={(page, type, originalElement) => {
//                     if (type === "page") {
//                         return (
//                             <button
//                                 disabled={page === params?.page} // disable current page
//                                 className={`px-3 ${page === params?.page ? "cursor-not-allowed"
//                                     : ""
//                                     }`}
//                             >
//                                 {page}
//                             </button>
//                         );
//                     }
//                     return originalElement;
//                 }}
//             />
//         </section>
//     );
// };

// export default PaymentTransactions;
