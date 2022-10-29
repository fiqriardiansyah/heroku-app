import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import authService from "services/auth";

const useAuthChange = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        onAuthStateChanged(authService.auth, (usr) => {
            setUser(usr);
            setLoading(false);
        });
    }, []);
    return { user, loading };
};

export default useAuthChange;
