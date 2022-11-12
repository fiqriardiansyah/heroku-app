import { ChatInfo, TaskProgress } from "models";
import React, { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { CURRENT_ROLE } from "utils/constant";

type Props = {
    children: any;
};

type StateType = {
    tasksProgress: TaskProgress[];
};

type ValueContextType = {
    state?: StateType;
    setState?: Dispatch<SetStateAction<StateType>>;
    getThisTask?: (id: string) => TaskProgress;
};

const ChatContext = createContext<ValueContextType>({
    state: {
        tasksProgress: [],
    },
});

function ChatProvider({ children }: Props) {
    const [state, setState] = useState<StateType>({
        tasksProgress: [],
    });

    const getThisTask = (id: string) => {
        return state.tasksProgress.find((task) => task.mid === id);
    };

    const value = useMemo(
        () => ({
            state,
            setState,
            getThisTask,
        }),
        [state]
    );
    return <ChatContext.Provider value={value as any}>{children}</ChatContext.Provider>;
}

export { ChatContext, ChatProvider };
