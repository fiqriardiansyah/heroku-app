import { UserContext } from "context/user";
import { onAuthStateChanged, User as UserFirebase } from "firebase/auth";
import { User } from "models";
import React, { useContext, useEffect, useState } from "react";
import authService from "services/auth";
import userService from "services/user";

const useAuthChange = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserFirebase | null>(null);

    useEffect(() => {
        onAuthStateChanged(authService.auth, async (usr) => {
            setUser(usr);
            setLoading(false);
        });
    }, []);
    return { user, loading };
};

export default useAuthChange;
