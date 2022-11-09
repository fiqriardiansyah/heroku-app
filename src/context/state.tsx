import React, { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { CURRENT_ROLE } from "utils/constant";

type Props = {
    children: any;
};

type StateType = {
    role: "hero" | "owner";
};

type ValueContextType = {
    state?: StateType;
    setState?: Dispatch<SetStateAction<StateType>>;
    changeRole?: () => {};
};

const StateContext = createContext<ValueContextType>({
    state: {
        role: (localStorage.getItem(CURRENT_ROLE) || "hero") as any,
    },
});

function StateProvider({ children }: Props) {
    const [state, setState] = useState<StateType>({
        role: (localStorage.getItem(CURRENT_ROLE) || "hero") as any,
    });

    const changeRole = () => {
        setState((prev) => {
            const switchRole = prev.role === "hero" ? "owner" : "hero";
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
        }),
        [state]
    );
    return <StateContext.Provider value={value as any}>{children}</StateContext.Provider>;
}

export { StateContext, StateProvider };
