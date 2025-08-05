import React from 'react'
import dayjs from "dayjs"

import { Checkbox, Empty, Spin } from 'antd';
import ArrowIcon from "assets/icons/arrow-icon.svg?react"


interface CustomAlertTableInter {
    tableHeaders: any[];
    data: any[];
    message: string;
    handleAlertClick: (data: any) => void;
    isLoading: boolean;
    handleCheckbox: (data: any) => void;
}

const CustomAlertTable: React.FC<CustomAlertTableInter> = ({ tableHeaders, data, handleCheckbox, handleAlertClick, isLoading, message }) => {
    return (
        <div className="overflow-x-auto w-full">
            {isLoading ?
                <div className='flex justify-center items-center h-32'>
                    <Spin size="large" />
                </div>
                :
                <div className="min-w-[1200px] mb-5">
                    {/* Table Header */}
                    <div className="flex border border-light-blue rounded py-3 mt-10">
                        {tableHeaders.map((header) => (
                            <div
                                key={header.key}
                                className={`border-r border-light-blue px-0 xl:px-6 py-1 text-light-gray text-center font-medium ${header.className}`}
                            >
                                {header.title}
                            </div>
                        ))}
                    </div>

                    {/* Table Body */}
                    <div>
                        {data?.length > 0 ? (
                            data?.map((alert, index) => (
                                <div key={index} className="py-0 flex text-start xl:text-center items-center hover:bg-gray-50 border-b border-border-gray">
                                    <div className="p-4 whitespace-nowrap text-sm w-[15%] flex justify-center gap-6 items-center">
                                        <Checkbox
                                            checked={alert?.checked}
                                            onChange={() => handleCheckbox(alert)}
                                        />
                                        {alert.serviceId}
                                    </div>
                                    <div className="p-4 px-0 xl:px-4 text-sm w-[15%]">{alert?.client?.basicInformation.clientName}</div>
                                    <div className="p-4 px-0 xl:px-4 text-sm w-[15%]">{alert?.assignedTo?.name}</div>
                                    <div className="p-4 px-0 xl:px-4 whitespace-nowrap text-sm w-[15%]">{dayjs(alert?.alertDate || alert?.warningDate).format("MM/DD/YYYY")}</div>
                                    <div className="p-4 px-0 xl:px-4 text-sm text-start w-[40%]">{alert?.alertMessage || alert?.warningMessage}</div>
                                    <div className="p-4 px-0 xl:px-4 whitespace-nowrap text-sm flex-1">
                                        <ArrowIcon
                                            className="text-gray-400 hover:text-blue-500 cursor-pointer"
                                            onClick={() => handleAlertClick(alert)}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Empty className="my-12" description={message} />
                        )}
                    </div>
                </div>}
        </div>
    )
}

export default CustomAlertTable