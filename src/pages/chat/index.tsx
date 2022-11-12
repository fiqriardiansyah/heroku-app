import React from "react";
import Layout from "components/common/layout";
import Chats from "module/chat/components/chats";
import Chat from "module/chat/components/chat";
import { ChatProvider } from "context/chat";

function ChatPage() {
    return (
        <ChatProvider>
            <Layout useFooter={false}>
                <div className="w-full h-90vh pt-10">
                    <div className="bg-white w-full h-full border rounded-xl border-solid border-gray-300 flex">
                        <div className="flex-1 py-3">
                            <Chats />
                        </div>
                        <div className="h-full bg-slate-300" style={{ width: "1px" }} />
                        <div className="flex-3">
                            <Chat />
                        </div>
                    </div>
                </div>
            </Layout>
        </ChatProvider>
    );
}

export default ChatPage;
