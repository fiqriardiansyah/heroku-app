import { Button } from "antd";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import InputFile from "components/form/inputs/input-file";
import { DataMessage } from "module/chat/models";
import React, { useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { IoMdCloseCircle } from "react-icons/io";
import Utils from "utils";
import PreviewFile from "./preview-file";

type Props = {
    onSubmitMessage: (data: DataMessage) => void;
};

function ChatInput({ onSubmitMessage }: Props) {
    const [focus, setFocus] = useState(false);
    const inputTextRef = useRef<HTMLDivElement>(null);
    const btnRemoveFileRef = useRef<HTMLButtonElement>(null);
    const btnSubmitRef = useRef<HTMLButtonElement>(null);
    const [file, setFile] = useState<File | null>(null);

    const [textMessage, setTextMessage] = useState("");

    const onInput = (e: any) => setTextMessage(e.target.innerText);

    const deleteFile = () => {
        if (btnRemoveFileRef.current) {
            btnRemoveFileRef.current.click();
        }
    };

    const onSubmit = (e: any) => {
        e?.preventDefault();
        if (!inputTextRef.current) return;
        const contentText = inputTextRef.current.innerText.trim().slice();
        const htmlMessage = inputTextRef.current.innerHTML.trim().slice();
        if ((!contentText || contentText === "") && !file) return;
        onSubmitMessage({
            file,
            message: htmlMessage,
            typeFile: file ? file.type : "",
        });
        deleteFile();
    };

    const onKeyDownInput = (e: any) => {
        if (e.keyCode === 13) {
            if (btnSubmitRef.current && inputTextRef.current && !e.shiftKey) {
                btnSubmitRef.current.click();
                inputTextRef.current.innerHTML = "";
                setTextMessage("");
            }
        }
    };

    const onKeyUpInput = (e: any) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            setTextMessage("");
            if (!inputTextRef.current) return;
            inputTextRef.current.innerHTML = "";
        }
    };

    const onPaste = async (e: any) => {
        e.preventDefault();

        const paste = await Utils.onPaste(e);
        if (paste?.type === "text") {
            return document.execCommand("insertText", false, paste.value);
        }
        return "";
    };

    const onFocus = () => {
        setFocus(true);
    };

    const onBlur = () => {
        setFocus(false);
    };

    const fileHandleChange = (fl: any) => {
        setFile(fl);
    };

    return (
        <form onSubmit={onSubmit} className="px-10 py-3 flex items-end bg-gray-100">
            <InputFile
                handleChange={fileHandleChange}
                action={(prop) => (
                    <button ref={btnRemoveFileRef} type="button" onClick={prop.deleteFile} className="hidden">
                        delete file
                    </button>
                )}
                types={["pdf", "jpg", "jpeg", "png", "webp", "zip"]}
                name="file"
            >
                <Button
                    size="large"
                    shape="circle"
                    className="!flex !items-center !justify-center !border-none !text-primary"
                    icon={<GrAttachment />}
                />
            </InputFile>
            <div className="w-full flex items-center relative mx-2">
                <PreviewFile file={file} onClickDelete={deleteFile} />
                {!focus && !textMessage && (
                    <span className="pointer-events-none absolute top-1/2 left-4 transform -translate-y-1/2">Ketik pesan...</span>
                )}
                <div
                    className="bg-white border-solid w-full p-3 focus:outline-primary border border-gray-300 rounded-xl overflow-y-auto max-h-[100px] min-h-[50px]"
                    tabIndex={0}
                    ref={inputTextRef}
                    onInput={onInput}
                    onKeyDown={onKeyDownInput}
                    onKeyUp={onKeyUpInput}
                    onPaste={onPaste}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    aria-autocomplete="none"
                    autoCorrect="off"
                    spellCheck="false"
                    aria-multiline="true"
                    aria-label="Message"
                    dir="auto"
                    contentEditable="true"
                    role="textbox"
                />
            </div>
            <Button
                ref={btnSubmitRef}
                htmlType="submit"
                size="large"
                shape="circle"
                className="!flex !items-center !justify-center !border-none !text-primary"
                icon={<FaPaperPlane />}
            />
        </form>
    );
}

export default ChatInput;
