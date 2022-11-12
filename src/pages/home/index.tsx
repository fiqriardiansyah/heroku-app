import React, { useEffect } from "react";
import Layout from "components/common/layout";
import HomeNotSignIn from "module/home/not-signin";
import HomeSignIn from "module/home/signin";
import authService from "services/auth";
import chatService from "services/chat";

function Home() {
    const user = authService.CurrentUser();

    return <Layout>{user ? <HomeSignIn /> : <HomeNotSignIn />}</Layout>;
}

export default Home;
