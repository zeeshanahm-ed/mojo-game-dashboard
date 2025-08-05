import React, { useState } from 'react';
import { Select } from 'antd';
import { FormattedClient } from 'pages/services/core/_modals';
import UserIcon from 'assets/icons/services-user-icon.svg?react';
import styled from 'styled-components';

interface SearchableSelectProps {
    data: FormattedClient[];
    placeholder?: string;
    style?: React.CSSProperties;
    onSearch: (value: string) => void;
    handleInputChange: (value: FormattedClient | undefined) => void;
    allowClear?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    data,
    placeholder,
    onSearch,
    handleInputChange,
    allowClear
}) => {
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

    const handleChange = (value: unknown) => {
        const stringValue = value as string;
        setSelectedValue(stringValue);
        const selectedOption = data.find(option => option.id === stringValue);
        handleInputChange(selectedOption);
    };

    return (
        <div className="relative h-11 p-3 border border-gray-300 rounded-[3px]">
            <UserIcon
                style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    zIndex: 2,
                }}
            />
            <StyledSelect
                showSearch
                allowClear={allowClear}
                value={selectedValue}
                placeholder={placeholder}
                style={{ width: '90%', textAlign: 'left' }}
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={(input, option) => {
                    const client = data.find((d) => d.id === option?.value)
                    return (
                        client?.clientName?.toLowerCase().includes(input.toLowerCase()) ||
                        false ||
                        client?.clientId?.toLowerCase().includes(input.toLowerCase()) ||
                        false
                    )
                }}
                onSearch={onSearch}
                onChange={handleChange}
                notFoundContent={null}
                options={data.map((d) => ({
                    value: d.id,
                    label: d.clientName,
                }))}
                className='custom-radius h-10'
            />
        </div>
    );
};

const StyledSelect = styled(Select)`
    &.ant-select {
        border: none;
        position:relative;
        left:20px;
        top:-12px;
    }

    .ant-select-selector {
        border: none !important; 
        box-shadow: none !important;
    }

    .ant-select-selection-item {
        display: flex;
        align-items: center;
    }

    .ant-select-selection-item {
        padding-left: 10px !important;
    }
`;

export default SearchableSelect;
