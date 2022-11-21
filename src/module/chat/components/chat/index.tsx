import { StateContext } from "context/state";
import { DataMessage } from "module/chat/models";
import { v4 as uuid } from "uuid";
import React, { useContext, useEffect } from "react";
import authService from "services/auth";
import chatService from "services/chat";
import HerokuImage from "assets/svgs/heroku-image.svg";
import useFileUpload from "hooks/useFileUpload";
import fileService from "services/file";
import { ChatContext } from "context/chat";
import ChatInput from "./chat-input";
import HeaderChat from "./header";
import Messages from "./messages";

function Chat() {
    const user = authService.CurrentUser();
    const { state } = useContext(StateContext);
    const { setState: setChatState } = useContext(ChatContext);

    const { uploadFile, tasksProgress } = useFileUpload(
        (params) => {
            return fileService.SaveChatFile({
                file: params.file,
            });
        },
        {
            cid: state?.chatActive?.cid as any,
        }
    );

    useEffect(() => {
        if (setChatState) {
            setChatState((prev) => ({
                ...prev,
                tasksProgress,
            }));
        }
    }, [tasksProgress]);

    const onSubmitMessage = async (data: DataMessage) => {
        const messageId = await chatService.SendMessage({
            anytitle: (state?.chatActive?.anytitle as any) || "",
            anyid: state?.chatActive?.anyid as any,
            uid2: state?.chatActive?.uid as any,
            uid: user?.uid as any,
            typework: state?.chatActive?.type_work as any,
            data,
        });
        if (!data.file) return;
        uploadFile({
            file: data.file,
            messageId,
        });
    };

    return (
        <div className="flex flex-col h-full">
            {state?.chatActive ? (
                <>
                    <HeaderChat />
                    <Messages />
                    <ChatInput onSubmitMessage={onSubmitMessage} />
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center flex-col pointer-events-none">
                    <img src={HerokuImage} alt="" className="opacity-50 grayscale w-full md:w-auto" />
                    <p className="text-gray-300 font-medium text-2xl">Start connect to your partner</p>
                </div>
            )}
        </div>
    );
}

export default Chat;
