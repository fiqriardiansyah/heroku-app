import React from "react";
import { ColProps, InputNumberProps } from "antd";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import InputNumber from "../inputs/input-number";

type Props<T extends FieldValues> = InputNumberProps & {
    type?: string;
    placeholder: string;
    label: string;
    control: Control<T, any>;
    name: Path<T>;
    labelCol?: ColProps;
    initialValue?: string;
};

function ControlledInputNumber<T extends FieldValues>({ label, control, placeholder, name, labelCol, initialValue, ...rest }: Props<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <InputNumber
                    {...field}
                    {...rest}
                    label={label}
                    labelCol={labelCol}
                    placeholder={placeholder}
                    value={(field.value as unknown as never) || rest.value}
                    initialValue={initialValue}
                    error={error?.message}
                />
            )}
        />
    );
}

export default ControlledInputNumber;
