import React from "react";
import { ColProps, InputProps } from "antd";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import InputText from "../inputs/input-text";

type ControlledInputTextProps<T extends FieldValues> = InputProps & {
    type?: string;
    placeholder: string;
    label: string;
    control: Control<T, any>;
    name: Path<T>;
    labelCol?: ColProps;
    initialValue?: string;
};

function ControlledInputText<T extends FieldValues>({
    label,
    type = "text",
    control,
    placeholder,
    name,
    labelCol,
    initialValue,
    ...rest
}: ControlledInputTextProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <InputText
                    {...field}
                    {...rest}
                    label={label}
                    labelCol={labelCol}
                    type={type}
                    placeholder={placeholder}
                    value={(field.value as unknown as never) || rest.value}
                    initialValue={initialValue}
                    error={error?.message}
                />
            )}
        />
    );
}

export default ControlledInputText;
