import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { IoMdCloseCircle } from "react-icons/io";
import { FILE_SIZE_ERROR, FILE_TYPE_ERROR } from "utils/constant";

type ActionType = {
    deleteFile: () => void;
};

type Props = {
    name: string;
    types: string[];
    label?: string;
    disable?: boolean;
    hoverTitle?: string;
    fileOrFiles?: null | any[];
    classes?: string;
    onTypeError?: (err: any) => void;
    children?: any;
    maxSize?: number;
    minSize?: number;
    onSizeError?: (file: any) => void;
    onDrop?: (file: any) => void;
    onSelect?: (file: any) => void;
    handleChange?: (file: any) => void;
    onDraggingStateChange?: (dragging: any) => void;
    action?: (prop: ActionType) => void;
};

function InputFile({ ...props }: Props) {
    const [error, setError] = useState("");
    const [file, setFile] = useState<any | null>(null);
    const handleChange = (fl: any) => {
        setError("");
        setFile(fl);
        if (props.handleChange) {
            props.handleChange(fl);
        }
    };

    const onSizeError = (err: any) => {
        setError(err || FILE_SIZE_ERROR);
        if (props.onSizeError) {
            props.onSizeError(err || FILE_SIZE_ERROR);
        }
    };

    const onTypeError = (err: any) => {
        setError(err || FILE_TYPE_ERROR);
        if (props.onTypeError) {
            props.onTypeError(err || FILE_TYPE_ERROR);
        }
    };

    const onDelete = () => {
        handleChange(null);
    };

    const propAction: ActionType = {
        deleteFile: onDelete,
    };

    return (
        <>
            {props.action && props.action(propAction)}
            {props.label && <p className="m-0 capitalize mb-2">{props.label}</p>}
            <div className="relative">
                <FileUploader
                    {...props}
                    multiple={false}
                    classes="INPUT-FILE-UPLOADER"
                    onTypeError={onTypeError}
                    onSizeError={onSizeError}
                    handleChange={handleChange}
                >
                    {props.children ? (
                        props.children
                    ) : (
                        <button
                            type="button"
                            className="flex items-center justify-between border rounded-md border-solid cursor-pointer border-gray-300 w-full py-2 px-2"
                        >
                            {!file ? (
                                <p className="m-0 text-xs text-gray-400">Drop Or Click</p>
                            ) : (
                                <EllipsisMiddle className="text-xs !max-w-[90%]" suffixCount={20}>
                                    {file?.name}
                                </EllipsisMiddle>
                            )}
                        </button>
                    )}
                </FileUploader>
                {file && !props.children && (
                    <button type="button" onClick={onDelete} className="border-none absolute right-2 top-1/2 transform -translate-y-1/2">
                        <IoMdCloseCircle className="text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 m-0 my-1 text-sm capitalize">{error}</p>}
        </>
    );
}

export default InputFile;
