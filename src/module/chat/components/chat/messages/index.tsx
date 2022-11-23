import { Alert, Spin } from "antd";
import InputFile from "components/form/inputs/input-file";
import { StateContext } from "context/state";
import useRealtimeValue from "hooks/useRealtimeValue";
import VisibilitySensor from "react-visibility-sensor";
import { MessageBuble } from "models";
import React, { useContext, useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import JsonEmptyAnim from "assets/animation/empty.json";
import JsonChatAnim from "assets/animation/chat.json";
import chatService from "services/chat";
import Utils from "utils";
import moment from "moment";
import MessageItem from "./item";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: JsonChatAnim,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

function Messages() {
    const { state } = useContext(StateContext);

    const scrollToBottom = useRef<HTMLDivElement | null>(null);
    const messagesContainer = useRef<HTMLDivElement | null>(null);
    const [bottomSeen, setBottomSeen] = useState<boolean>(false);

    const { data, loading } = useRealtimeValue<MessageBuble[]>(({ setData, setLoading }) => {
        chatService._observeMyMessage({
            cid: state?.chatActive?.cid as any,
            callback: (messages) => {
                setLoading(false);
                setData(messages);
            },
        });
    }, state?.chatActive);

    const scrollToBottomHandler = (isSmooth: any) => {
        if (scrollToBottom.current) scrollToBottom.current.scrollIntoView(isSmooth ? { behavior: "smooth" } : {});
    };

    useEffect(() => {
        if (bottomSeen) {
            scrollToBottomHandler(false);
            if (messagesContainer.current) {
                new ResizeObserver(scrollToBottomHandler).observe(messagesContainer.current);
            }
        }
    }, [data]);

    return (
        <div className="h-full w-full overflow-y-auto flex-1 bg-gray-100 flex flex-col px-24">
            <Alert
                type="warning"
                description="Be careful of fraud, do not provide personal information such as telephone numbers, id cards and others"
            />
            {data?.length === 0 && !loading && (
                <div className="w-full h-full flex justify-center items-center flex-col">
                    <Lottie isClickToPauseDisabled options={defaultOptions} height={150} width={150} />
                    <p className="text-center capitalize font-medium text-gray-400">Say halo!</p>
                </div>
            )}
            {loading && (
                <div className="w-full h-full flex items-center justify-center">
                    <Spin />
                </div>
            )}
            {data &&
                data?.map((el, i) => {
                    if (!Utils.isDifferentDate({ time: el.date, prevTime: data[i - 1]?.date })) {
                        return (
                            <>
                                <p key={`date-${el.id}`} className="self-center bg-gray-300 px-4 py-1 rounded-md text-xs m-0 mt-2">
                                    {moment(el.date).format("DD MMM yyyy")}
                                </p>
                                <MessageItem data={el} key={el.id} />
                            </>
                        );
                    }
                    return <MessageItem data={el} key={el.id} />;
                })}

            <VisibilitySensor scrollCheck="true" onChange={(v: boolean) => setBottomSeen(v)}>
                <div ref={scrollToBottom} className="flex w-full mt-4">
                    <div className="h-1 w-full" />
                </div>
            </VisibilitySensor>
        </div>
    );
}

export default Messages;
