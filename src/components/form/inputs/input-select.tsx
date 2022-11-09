import { Form, Select, SelectProps } from "antd";
import React, { forwardRef } from "react";

export type SelectOption = {
    label: string;
    value: number;
};

type InputSelectProps = SelectProps & {
    error: string | undefined;
    label: string;
    options: SelectOption[];
};

const InputSelect: React.FC<InputSelectProps> = forwardRef(
    ({ placeholder, error, label, value, onChange, options, loading, ...rest }: InputSelectProps) => (
        <Form.Item label={label} validateStatus={error ? "error" : ""} help={error && error} labelCol={{ xs: 24 }} className="!w-full">
            <Select {...rest} value={value} loading={loading} placeholder={placeholder} onChange={onChange}>
                {options.map((option) => {
                    return (
                        <Select.Option value={option.value} key={option.value}>
                            {option.label}
                        </Select.Option>
                    );
                })}
            </Select>
        </Form.Item>
    )
);

InputSelect.displayName = "InputSelect";

export default InputSelect;
