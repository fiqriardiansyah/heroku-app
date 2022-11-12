import { Alert } from "antd";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import React from "react";
import { FaFileDownload } from "react-icons/fa";

type Props = {
    url: string;
    name: string;
};

function ButtonFileDownload({ url, name }: Props) {
    const onClickDownloadHandler = () => {
        const link = document.createElement("a") as HTMLAnchorElement;
        link.href = url;
        link.setAttribute("download", name);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
    };

    if (!url) {
        return <Alert message="No file to download!" type="error" className="w-fit" />;
    }

    return (
        <button
            onClick={onClickDownloadHandler}
            type="button"
            className="w-fit flex items-center px-6 py-3 rounded-md border-none bg-gray-300 cursor-pointer"
        >
            <FaFileDownload className="text-xl text-gray-500" />
            <p className="m-0 ml-2">
                <EllipsisMiddle suffixCount={10}>{name}</EllipsisMiddle>
            </p>
        </button>
    );
}

export default ButtonFileDownload;
