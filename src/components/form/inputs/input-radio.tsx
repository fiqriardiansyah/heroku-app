import { ColProps, Form, Radio, Select, RadioGroupProps } from "antd";
import React, { forwardRef } from "react";

export type SelectOption = {
    label: string;
    value: number;
};

type Props = RadioGroupProps & {
    error: string | undefined;
    label: string;
    options: SelectOption[];
    labelCol?: ColProps;
};

const InputRadio: React.FC<Props> = forwardRef(({ error, label, value, onChange, options, labelCol, ...rest }: Props) => (
    <Form.Item label={label} validateStatus={error ? "error" : ""} help={error && error} labelCol={labelCol} className="!w-full">
        <Radio.Group {...rest} onChange={onChange} value={value}>
            {options.map((option: SelectOption) => (
                <Radio key={option.value} value={option.value}>
                    {option.label}
                </Radio>
            ))}
        </Radio.Group>
    </Form.Item>
));

InputRadio.displayName = "InputRadio";

export default InputRadio;
