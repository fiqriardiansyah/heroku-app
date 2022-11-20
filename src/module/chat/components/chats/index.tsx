/* eslint-disable react/no-array-index-key */
import { Skeleton } from "antd";
import { StateContext } from "context/state";
import { UserContext } from "context/user";
import Lottie from "react-lottie";
import useRealtimeValue from "hooks/useRealtimeValue";
import { ChatInfo } from "models";
import React, { useContext } from "react";
import chatService from "services/chat";
import JsonEmptyAnim from "assets/animation/empty.json";
import ChatItem from "./item";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: JsonEmptyAnim,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

function Chats() {
    const { setChatActive } = useContext(StateContext);
    const { state } = useContext(UserContext);
    const { data, loading } = useRealtimeValue<ChatInfo[]>(({ setData, setLoading }) => {
        chatService.realtimeDatabase?._observeMyChats({
            uid: state.user?.uid as any,
            callback: (chats) => {
                setLoading(false);
                setData(chats?.sort((a, b) => b.last_chat - a.last_chat));
            },
        });
    }, state.user?.uid);

    const onChatClickHandler = (chatInfo: ChatInfo) => {
        if (setChatActive) {
            setChatActive(chatInfo);
        }
    };

    return (
        <div className="w-full overflow-y-auto h-full">
            {loading && [...new Array(3)].map((_, i) => <Skeleton active round avatar className="transform scale-90" key={i} />)}
            {data && data?.map((chat) => <ChatItem onClick={onChatClickHandler} data={chat} key={chat.last_message + (chat?.type || "")} />)}
            {data?.length === 0 && !loading && (
                <div className="w-full h-full flex justify-center items-center flex-col">
                    <Lottie isClickToPauseDisabled options={defaultOptions} height={150} width={150} />
                    <p className="text-center capitalize font-medium text-xl text-gray-400">you don&apos;t have any conversation</p>
                </div>
            )}
        </div>
    );
}

export default Chats;
