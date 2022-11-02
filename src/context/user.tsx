import { User } from "models";
import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useMemo,
    useState,
} from "react";

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
    const [state, setState] = useState<UserData>({
        user: null,
    });

    const saveUser = (data: User | null = null) => {
        setState((prev) => ({
            ...prev,
            user: data,
        }));
    };

    const value = useMemo(
        () => ({
            state,
            setState,
            saveUser,
        }),
        [state]
    );
    return (
        <UserContext.Provider value={value as any}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };
