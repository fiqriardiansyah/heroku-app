import { StateContext } from "context/state";
import { ChatInfo } from "models";
import React, { useContext } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CHAT_PATH } from "utils/routes";

type Props = {
    disabled?: boolean;
    chatInfo: ChatInfo;
};

function ButtonChat({ disabled, chatInfo }: Props) {
    const { setChatActive } = useContext(StateContext);
    const navigate = useNavigate();

    const onClickChatHandler = () => {
        if (setChatActive) {
            setChatActive(chatInfo);
            navigate(CHAT_PATH);
        }
    };

    return (
        <button
            onClick={onClickChatHandler}
            disabled={disabled}
            className="cursor-pointer rounded-full w-10 h-10 bg-white border-solid border border-primary flex items-center justify-center"
            type="button"
        >
            <FaTelegramPlane className="text-primary text-2xl" />
        </button>
    );
}

export default ButtonChat;
