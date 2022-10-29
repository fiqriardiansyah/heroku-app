import React from "react";
import { SelectProps } from "antd";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import SelectInput, { SelectOption } from "../inputs/input-select";

type ControlledInputSelectProps<T extends FieldValues> = SelectProps & {
    placeholder: string;
    label: string;
    control: Control<T, any>;
    name: Path<T>;
    options: SelectOption[];
};

function ControlledSelectInput<T extends FieldValues>({
    label,
    control,
    placeholder,
    name,
    loading,
    options,
    ...rest
}: ControlledInputSelectProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <SelectInput
                    {...field}
                    {...rest}
                    label={label}
                    options={options}
                    placeholder={placeholder}
                    error={error?.message}
                    value={field.value}
                    loading={loading}
                />
            )}
        />
    );
}

export default ControlledSelectInput;
