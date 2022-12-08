import { ChatInfo } from "models";
import React, { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { CURRENT_ROLE, HERO, OWNER } from "utils/constant";

type Props = {
    children: any;
};

type StateType = {
    role: "hero" | "owner";
    chatActive: ChatInfo | null;
};

type ValueContextType = {
    state?: StateType;
    setState?: Dispatch<SetStateAction<StateType>>;
    changeRole?: () => {};
    setChatActive?: (data: ChatInfo) => {};
};

const StateContext = createContext<ValueContextType>({
    state: {
        role: (localStorage.getItem(CURRENT_ROLE) || HERO) as any,
        chatActive: null,
    },
});

function StateProvider({ children }: Props) {
    const [state, setState] = useState<StateType>({
        role: (localStorage.getItem(CURRENT_ROLE) || HERO) as any,
        chatActive: null,
    });

    const setChatActive = (chatInfo: ChatInfo) => {
        setState((prev) => ({
            ...prev,
            chatActive: chatInfo,
        }));
    };

    const changeRole = () => {
        setState((prev) => {
            const switchRole = prev.role === HERO ? OWNER : HERO;
            localStorage.setItem(CURRENT_ROLE, switchRole);
            return {
                ...prev,
                role: switchRole,
            };
        });
    };

    const value = useMemo(
        () => ({
            state,
            setState,
            changeRole,
            setChatActive,
        }),
        [state]
    );
    return <StateContext.Provider value={value as any}>{children}</StateContext.Provider>;
}

export { StateContext, StateProvider };
