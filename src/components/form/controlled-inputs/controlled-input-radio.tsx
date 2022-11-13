import React from "react";
import { ColProps, RadioGroupProps } from "antd";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import SelectInput, { SelectOption } from "../inputs/input-select";
import InputRadio from "../inputs/input-radio";

type Props<T extends FieldValues> = RadioGroupProps & {
    label: string;
    control: Control<T, any>;
    name: Path<T>;
    options: SelectOption[];
    labelCol?: ColProps;
};

function ControlledRadioInput<T extends FieldValues>({ label, control, name, options, labelCol, ...rest }: Props<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <InputRadio {...field} {...rest} label={label} labelCol={labelCol} options={options} error={error?.message} value={field.value} />
            )}
        />
    );
}

export default ControlledRadioInput;
