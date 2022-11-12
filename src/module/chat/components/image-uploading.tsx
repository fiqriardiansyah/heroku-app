import { Progress, Spin } from "antd";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { VscError } from "react-icons/vsc";

type Props = {
    status?: "uploading" | "failed";
    myPov: boolean;
    progress?: number;
    error?: any;
};

function ImageUploading({ status, myPov, progress, error }: Props) {
    if (myPov) {
        return (
            <div className="w-[200px] h-[200px] bg-gray-300 rounded-md flex items-center justify-center">
                <Progress type="circle" percent={Math.floor(progress || 0)} width={40} status={error ? "exception" : "normal"} />
            </div>
        );
    }
    return (
        <div className="w-[200px] h-[200px] bg-gray-300 rounded-md flex items-center justify-center">
            {status === "failed" ? (
                <VscError className="text-red-400 text-7xl opacity-60" />
            ) : (
                <Spin indicator={<AiOutlineLoading className="SPIN !text-6xl" />} />
            )}
        </div>
    );
}

export default ImageUploading;
