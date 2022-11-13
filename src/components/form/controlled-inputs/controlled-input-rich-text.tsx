import React from "react";
import { ColProps, InputProps } from "antd";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ReactQuillProps } from "react-quill";
import InputText from "../inputs/input-text";
import InputRichText from "../inputs/input-rich-text";

type Props<T extends FieldValues> = ReactQuillProps & {
    placeholder: string;
    label: string;
    control: Control<T, any>;
    name: Path<T>;
    labelCol?: ColProps;
    initialValue?: string;
};

function ControlledInputRichText<T extends FieldValues>({ label, control, placeholder, name, labelCol, initialValue, ...rest }: Props<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <InputRichText
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

export default ControlledInputRichText;
