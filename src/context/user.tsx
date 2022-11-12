import useAuthChange from "hooks/useAuthChange";
import useRealtimeValue from "hooks/useRealtimeValue";
import { ChatInfo, User } from "models";
import React, { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import userService from "services/user";

type Props = {
    children: any;
};

type UserData = {
    user: User | null;
};

type ValueContextType = {
    state: UserData;
    setState?: Dispatch<SetStateAction<UserData>>;
    saveUser?: (data: User) => {};
};

const UserContext = createContext<ValueContextType>({
    state: {
        user: null,
    },
});

function UserProvider({ children }: Props) {
    const { user: userAuth } = useAuthChange();
    const [state, setState] = useState<UserData>({
        user: null,
    });

    const saveUser = (user: User | null = null) => {
        setState((prev) => ({
            ...prev,
            user,
        }));
    };

    useRealtimeValue(({ setData, setLoading }) => {
        if (userAuth) {
            userService._observeMyProfile({
                uid: userAuth?.uid as any,
                callback: (user) => {
                    setLoading(false);
                    saveUser(user);
                },
            });
        }
    }, userAuth?.uid);

    const value = useMemo(
        () => ({
            state,
            setState,
            saveUser,
        }),
        [state]
    );
    return <UserContext.Provider value={value as any}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
