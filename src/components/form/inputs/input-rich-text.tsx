import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ColProps, Form, Input, InputProps, InputRef } from "antd";
import React, { forwardRef, Ref } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";

type TextInputProps = ReactQuillProps & {
    error: string | undefined;
    label: string;
    labelCol?: ColProps;
    initialValue?: string;
};

const InputRichText: React.FC<TextInputProps> = forwardRef(
    ({ label, labelCol, error, initialValue, ...props }: TextInputProps, ref: Ref<InputRef>) => {
        return (
            <Form.Item
                label={label}
                labelCol={labelCol}
                validateStatus={error ? "error" : ""}
                help={error && error}
                initialValue={initialValue}
                className="!w-full"
            >
                <ReactQuill theme="snow" {...props} />
            </Form.Item>
        );
    }
);

InputRichText.displayName = "InputRichText";

export default InputRichText;
