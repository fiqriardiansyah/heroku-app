import { Progress, Spin } from "antd";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { VscError } from "react-icons/vsc";

type Props = {
    text: string;
    status?: "uploading" | "failed";
    myPov: boolean;
    progress?: number;
    error?: any;
};

function FileUploading({ text, status, myPov, progress, error }: Props) {
    if (myPov) {
        return (
            <div className="bg-gray-200 rounded-md flex items-center justify-center max-w-[200px] px-5 py-2">
                <Progress type="circle" percent={Math.floor(progress || 0)} width={30} status={error ? "exception" : "normal"} />
                <EllipsisMiddle className="ml-3" suffixCount={10}>
                    {text}
                </EllipsisMiddle>
            </div>
        );
    }
    return (
        <div className="bg-gray-200 rounded-md flex items-center justify-center max-w-[200px] px-5 py-2">
            <EllipsisMiddle className="mr-3" suffixCount={10}>
                {text}
            </EllipsisMiddle>
            {status === "failed" ? (
                <Spin indicator={<VscError className="!text-red-400" />} />
            ) : (
                <Spin indicator={<AiOutlineLoading className="SPIN" />} />
            )}
        </div>
    );
}

export default FileUploading;
