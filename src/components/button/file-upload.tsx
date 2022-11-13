import { Image, Spin } from "antd";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import React, { useEffect, useState } from "react";
import { GoTrashcan } from "react-icons/go";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import Utils from "utils";
import { IMAGES_TYPE } from "utils/constant";

type Props = {
    mode: "remove" | "add";
    file?: File;
    onClickAdd?: () => void;
    onClickRemove?: (file: File | undefined) => void;
};

function ButtonFileUpload({ mode, file, onClickAdd, onClickRemove }: Props) {
    const [base64, setBase64] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            Utils.getBase64(file, (str) => {
                setBase64(str);
            });
        }
        setBase64(null);
    }, [file]);

    return (
        <button
            type="button"
            className="group relative min-w-[150px] min-h-[150px] p-0 m-0 bg-transparent border-dashed border-2 rounded-md border-primary"
        >
            {mode === "remove" && (
                <>
                    {IMAGES_TYPE.includes(file?.type || "") ? (
                        <Image
                            preview={false}
                            src={base64 || undefined}
                            width={150}
                            height={150}
                            className=" object-cover bg-gray-300 rounded-md border-none group-hover:opacity-50"
                        />
                    ) : (
                        <EllipsisMiddle suffixCount={5} className="w-[130px]">
                            {file?.name || "unknown"}
                        </EllipsisMiddle>
                    )}
                    <GoTrashcan
                        onClick={() => onClickRemove && onClickRemove(file)}
                        className="group-hover:opacity-100 cursor-pointer opacity-0 text-red-400 text-2xl absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    />
                </>
            )}
            {mode === "add" && (
                <MdOutlineAddCircleOutline
                    onClick={onClickAdd}
                    className=" !text-primary text-2xl absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                />
            )}
        </button>
    );
}

export default ButtonFileUpload;
