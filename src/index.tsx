import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { UserProvider } from "context/user";
import { StateProvider } from "context/state";
import App from "./app";
import "./style/index.css";
import "antd/dist/antd.min.css";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <StateProvider>
                    <App />
                </StateProvider>
            </UserProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    </React.StrictMode>
);
