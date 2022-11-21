import React, { useContext, useMemo } from "react";
import { ChatInfo } from "models";
import classNames from "classnames";
import moment from "moment";
import { IMAGES_TYPE, IMAGE_FALLBACK } from "utils/constant";
import Utils from "utils";
import { useQuery } from "react-query";
import userService from "services/user";
import { Image, Spin } from "antd";
import { BsCardImage } from "react-icons/bs";
import { AiFillFile } from "react-icons/ai";
import SkeletonInput from "antd/lib/skeleton/Input";
import { StateContext } from "context/state";
import { FaUserAlt } from "react-icons/fa";

type Props = {
    data: ChatInfo;
    onClick: (dt: ChatInfo) => void;
};

function ChatItem({ data, onClick }: Props) {
    const { state } = useContext(StateContext);

    const userQuery = useQuery([`get-user-${data.uid}`], async () => {
        const req = await userService.GetUser(data.uid);
        return req;
    });

    const className = classNames(
        "focus:outline-none focus:bg-gray-100 hover:bg-gray-100 pt-2 flex justify-start w-full px-2 cursor-pointer bg-transparent border-none",
        {
            "bg-blue-50": state?.chatActive?.id === data.id,
        }
    );

    const lastMessage = useMemo(() => {
        if (data.type === "text") {
            return <p className="m-0 text-xs text-left break-all">{Utils.stripHtml(data?.last_message || "").CutText(40)}</p>;
        }
        if (IMAGES_TYPE.includes(data?.type || "")) {
            return <BsCardImage className="text-gray-400" />;
        }
        return <AiFillFile className="text-gray-400" />;
    }, []);

    return (
        <button onClick={() => onClick(data)} type="button" className={className}>
            <Image
                preview={false}
                referrerPolicy="no-referrer"
                fallback={IMAGE_FALLBACK}
                src={userQuery.data?.profile}
                width={40}
                height={40}
                placeholder={
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                        <FaUserAlt className="text-2xl text-gray-400" />
                    </div>
                }
                className="flex-1 bg-gray-200 rounded-full object-cover overflow-hidden"
            />
            <div className="flex flex-col flex-1 ml-2">
                <div className="flex items-start justify-between">
                    {userQuery.isLoading ? (
                        <SkeletonInput active size="small" />
                    ) : (
                        <p className="m-0 capitalize text-sm text-gray-700">{userQuery.data?.name}</p>
                    )}
                    <span className="m-0 text-xs text-gray-300">{moment(data.last_chat).format("DD MMM, LT")}</span>
                </div>
                <p className="m-0 capitalize text-xs text-primary text-left">{data.anytitle}</p>
                {lastMessage}
                <div className="w-full bg-slate-200 mt-2" style={{ height: "1px" }} />
            </div>
        </button>
    );
}

export default ChatItem;
