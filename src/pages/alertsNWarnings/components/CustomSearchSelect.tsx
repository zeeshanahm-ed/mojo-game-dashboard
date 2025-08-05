import React from 'react'

import { Select } from 'antd';
import { FaUser } from "react-icons/fa";

interface CustomSearchSelectInter {
    value: any;
    data: any[];
    handleOnSearch: (value: any) => void;
    handleOnChange: (value: any) => void;
}

const CustomSearchSelect: React.FC<CustomSearchSelectInter> = ({ value, data, handleOnSearch, handleOnChange, ...props }) => {
    return (
        <div className={` flex items-center h-11 custom-radius border border-border-gray px-3`}>
            <FaUser className="text-2xl" /><span className="w-fit hidden xl:flex  text-nowrap mt-1 ml-3 font-medium">Assigned to :</span>
            <Select
                allowClear
                className="w-full h-12 text-left min-w-64 mt-1"
                placeholder="Select"
                variant="borderless"
                showSearch
                value={value}
                defaultActiveFirstOption={false}
                filterOption={(input, option) => {
                    const client = data.find((d) => d.id === option?.value)
                    return (
                        client?.clientName?.toLowerCase().includes(input.toLowerCase()) ||
                        false ||
                        client?.clientId?.toLowerCase().includes(input.toLowerCase()) ||
                        false
                    )
                }}
                onSearch={handleOnSearch}
                onChange={handleOnChange}
                notFoundContent={null}
                options={data.map((d) => ({
                    value: d.id,
                    label: d.clientName,
                }))}
                {...props}
            />
        </div>
    )
}

export default CustomSearchSelect