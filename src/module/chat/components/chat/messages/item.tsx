import { MessageBuble } from "models";
import React, { useContext } from "react";
import Autolinker from "autolinker";
import classNames from "classnames";
import authService from "services/auth";
import moment from "moment";
import { IMAGES_TYPE, IMAGE_FALLBACK } from "utils/constant";
import { Image } from "antd";
import { ChatContext } from "context/chat";
import ButtonFileDownload from "components/button/file-download";
import FileUploading from "../../file-uploading";
import ImageUploading from "../../image-uploading";

type Props = {
    data: MessageBuble;
};

const autolinker = new Autolinker({
    sanitizeHtml: false,
});

function MessageItem({ data }: Props) {
    const user = authService.CurrentUser();
    const { getThisTask } = useContext(ChatContext);

    const containerClassName = classNames("w-fit max-w-[70%] mt-3 flex flex-col", {
        "self-end": user?.uid === data.senderUid,
    });

    const messageClassName = classNames("p-2 bg-white w-fit rounded-xl break-all mt-2", {
        "self-end": user?.uid === data.senderUid,
        "rounded-tr-none": user?.uid === data.senderUid,
        "rounded-tl-none": user?.uid !== data.senderUid,
    });

    const boxClassName = classNames("flex flex-col", {
        "items-end": user?.uid === data.senderUid,
    });

    const task = getThisTask && getThisTask(data.id);

    return (
        <div id={`message${data.id}`} className={containerClassName}>
            <div className={boxClassName}>
                {/* uploading image or file */}
                {task && data.typeFile && IMAGES_TYPE.includes(data.typeFile) && <ImageUploading myPov progress={task.progress} error={task.error} />}
                {task && data.typeFile && !IMAGES_TYPE.includes(data.typeFile) && (
                    <FileUploading text={data.nameFile} myPov progress={task.progress} error={task.error} />
                )}

                {/* image */}
                {data.statusFile === "uploaded" && data.typeFile && IMAGES_TYPE.includes(data.typeFile) && (
                    <Image
                        fallback={IMAGE_FALLBACK}
                        loading="lazy"
                        className="rounded-md bg-gray-200 object-cover "
                        src={data.file || undefined}
                        width={200}
                        height={200}
                    />
                )}

                {/* file */}
                {data.statusFile === "uploaded" && data.typeFile && !IMAGES_TYPE.includes(data.typeFile) && (
                    <ButtonFileDownload name={data.nameFile} url={data.file} />
                )}

                {/* failed or uploading image for partner POV */}
                {(data.statusFile === "failed" || data.statusFile === "uploading") &&
                    user?.uid !== data.senderUid &&
                    data.typeFile &&
                    IMAGES_TYPE.includes(data.typeFile) && <ImageUploading myPov={false} status={data.statusFile} />}

                {/* failed or uploading file for partner POV */}
                {(data.statusFile === "failed" || data.statusFile === "uploading") &&
                    user?.uid !== data.senderUid &&
                    data.typeFile &&
                    !IMAGES_TYPE.includes(data.typeFile) && <FileUploading myPov={false} text={data.nameFile} status={data.statusFile} />}

                {/* message */}
                {data.message && <div className={messageClassName} dangerouslySetInnerHTML={{ __html: autolinker.link(data.message) }} />}
            </div>
            <span className="w-fit text-xs font-medium text-gray-400 self-end mt-1">{moment(data.date).format("LT")}</span>
        </div>
    );
}

export default MessageItem;
