import { StateContext } from "context/state";
import React, { useContext } from "react";
import authService from "services/auth";

function HomeSignIn() {
    const user = authService.CurrentUser();
    const { state } = useContext(StateContext);
    return (
        <div className="w-full">
            {`hallo ${user?.displayName || user?.email}`}
            <p>ini halaman home sudah login sebagai {state?.role}</p>
        </div>
    );
}

export default HomeSignIn;
