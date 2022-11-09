import { ColProps, Form, InputNumber as InputNumberAntd, InputNumberProps } from "antd";
import React, { forwardRef, Ref } from "react";
import Utils from "utils";
import { CURRENCY } from "utils/constant";

// utils

type TextInputProps = InputNumberProps & {
    error: string | undefined;
    label: string;
    labelCol?: ColProps;
    initialValue?: string;
};

const InputNumber: React.FC<TextInputProps> = forwardRef(
    ({ placeholder, error, label, name, labelCol, initialValue, onChange, value, onBlur, ...rest }: TextInputProps, ref: Ref<HTMLInputElement>) => {
        const currencyOptions = CURRENCY.map((c) => ({
            label: c.CcyNm,
            value: `${c.CtryNm}::${c.Ccy}`,
        }));

        return (
            <Form.Item
                label={label}
                labelCol={labelCol}
                validateStatus={error ? "error" : ""}
                help={error && error}
                initialValue={initialValue}
                className="!w-full"
            >
                <InputNumberAntd
                    {...rest}
                    value={value || ""}
                    style={{ width: "100%" }}
                    formatter={Utils.currencyFormatter(currencyOptions[0].value)}
                    parser={Utils.currencyParser}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    name={name}
                    placeholder={placeholder}
                />
            </Form.Item>
        );
    }
);

InputNumber.displayName = "InputNumber";

export default InputNumber;
