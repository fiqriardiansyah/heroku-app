import React, { useEffect, useState } from "react";
import { Image, Spin } from "antd";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import { IoMdCloseCircle } from "react-icons/io";
import Utils from "utils";

type Props = {
    file: any;
    onClickDelete: () => void;
};

function PreviewFile({ file, onClickDelete }: Props) {
    const [base64, setBase64] = useState<string | null>(null);
    const imagesType = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
    useEffect(() => {
        if (file) {
            Utils.getBase64(file, (str) => {
                setBase64(str);
            });
        }
        setBase64(null);
    }, [file]);

    if (!file) {
        return null;
    }
    return (
        <div className="flex flex-col absolute bottom-[110%] left-0 z-10">
            {imagesType.includes(file?.type) && (
                <Image
                    src={base64 || undefined}
                    width={200}
                    height={200}
                    className=" object-cover bg-gray-300 rounded-xl border-none"
                    placeholder={
                        <div className="h-full w-full flex items-center justify-center">
                            <Spin size="large" />
                        </div>
                    }
                />
            )}
            <div className="flex items-center bg-gray-200 rounded-md px-6 py-1 relative mt-1">
                <EllipsisMiddle className="text-xs !max-w-[90%] mr-3" suffixCount={20}>
                    {file?.name}
                </EllipsisMiddle>
                <button
                    onClick={onClickDelete}
                    type="button"
                    className="flex items-center justify-between border-none absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent"
                >
                    <IoMdCloseCircle className="text-gray-400 hover:text-gray-600" />
                </button>
            </div>
        </div>
    );
}

export default PreviewFile;
