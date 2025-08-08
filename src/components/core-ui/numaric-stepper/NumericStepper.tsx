import React, { useState, useCallback } from "react";
import { debounce } from "helpers/CustomHelpers";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export interface NumericStepperProps {
    initialValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
    formatter?: (value: number) => string;
}

const NumericStepper: React.FC<NumericStepperProps> = ({
    initialValue = 0,
    min = 0,
    max = Infinity,
    step = 1,
    onChange,
    formatter,
}) => {
    const [value, setValue] = useState<number>(initialValue);

    const debouncedOnChange = useCallback(
        debounce((v: number) => {
            if (onChange) {
                onChange(v);
            }
        }, 500),
        [onChange]
    );

    const handleIncrement = () => {
        setValue((prev) => {
            const updated = Math.min(max, prev + step);
            debouncedOnChange(updated);
            return updated;
        });
    };

    const handleDecrement = () => {
        setValue((prev) => {
            const updated = Math.max(min, prev - step);
            debouncedOnChange(updated);
            return updated;
        });
    };

    return (
        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-1 justify-between w-36">
            <span className="text-base">
                {formatter ? formatter(value) : value}
            </span>
            <div className="flex flex-col ml-2">
                <button
                    onClick={handleIncrement}
                    className="text-gray-600 hover:text-gray-900"
                >
                    <FiChevronUp size={18} />
                </button>
                <button
                    onClick={handleDecrement}
                    className="text-gray-600 hover:text-gray-900"
                >
                    <FiChevronDown size={18} />
                </button>
            </div>
        </div>
    );
};

export default NumericStepper;
