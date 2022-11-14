/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { FC } from "react";

type StateType = "empty" | "loading" | "data" | "error" | "blank";

function Data({ children, state }: { children: any; state: StateType }) {
    return state === "data" ? <>{children}</> : <></>;
}
function Loading({ children, state }: { children: any; state: StateType }) {
    return state === "loading" ? <>{children}</> : <></>;
}
function Empty({ children, state }: { children: any; state: StateType }) {
    return state === "empty" ? <>{children}</> : <></>;
}
function Error({ children, state }: { children: any; state: StateType }) {
    return state === "error" ? <>{children}</> : <></>;
}

type Props = {
    data: any;
    isLoading?: boolean;
    isEmpty?: boolean;
    isError?: any;
    isBlank?: boolean;
    children: (element: StateType) => void;
};

type IndexProps = Props;

function State({ data, isLoading, isEmpty, isError, children, isBlank }: IndexProps) {
    let state: StateType = "loading";

    if (data && !isEmpty) state = "data";
    else if (isLoading) state = "loading";
    else if (isEmpty && !isLoading && !isError) state = "empty";
    else if (isError) state = "error";
    else if (isBlank) state = "blank";
    else state = "blank";

    return <>{children(state)}</>;
}

State.Data = Data;
State.Loading = Loading;
State.Empty = Empty;
State.Error = Error;

export default State;
