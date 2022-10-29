import React from "react";
import Layout from "components/common/layout";
import HomeNotSignIn from "module/home/not-signin";
import HomeSignIn from "module/home/signin";
import authService from "services/auth";

function Home() {
    const user = authService.CurrentUser();

    return <Layout>{user ? <HomeSignIn /> : <HomeNotSignIn />}</Layout>;
}

export default Home;
