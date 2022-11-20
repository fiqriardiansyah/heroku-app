import React, { useContext } from "react";
import { Button, Spin } from "antd";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import useAuthChange from "hooks/useAuthChange";

// pages
import Home from "pages/home";
import SignIn from "pages/auth/sign-in";
import SignUp from "pages/auth/sign-up";
import Chat from "pages/chat";
import Profile from "pages/profile";
// as hero
import MyService from "pages/as-hero/my-service";
import MyJob from "pages/as-hero/my-job";
import DetailServiceHero from "pages/as-hero/detail-service";
import DetailJob from "pages/as-hero/detail-job";
import CreateService from "pages/as-hero/create-service";
// as owner
import CreatePost from "pages/as-owner/create-post";
import DetailPost from "pages/as-owner/detail-post";
import DetailServiceOwner from "pages/as-owner/detail-service";
import MyAssignment from "pages/as-owner/my-assignment";
import MyPost from "pages/as-owner/my-post";
import PostProgress from "pages/as-owner/post-progress";

import HerokuImage from "assets/svgs/heroku-image.svg";
import {
    CHAT_PATH,
    CREATE_POST_PATH,
    CREATE_SERVICE_PATH,
    DETAIL_JOB_PATH,
    DETAIL_POST_PATH,
    HOME_PATH,
    MY_ASSIGNMENT_PATH,
    MY_JOB_PATH,
    MY_POST_PATH,
    MY_SERVICE_PATH,
    PROFILE_PATH,
    SERVICE_HERO_PATH,
    SERVICE_OWNER_PATH,
    SIGN_IN_PATH,
    SIGN_UP_PATH,
} from "utils/routes";
import { StateContext } from "context/state";
import authService from "services/auth";

function App() {
    const { user, loading } = useAuthChange();
    const { state } = useContext(StateContext);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center flex-col">
                <img src={HerokuImage} alt="" className="h-[200px]" />
                <div className="flex items-center mt-5">
                    <Spin />
                    <p className="capitalize m-0 ml-2 text-gray-500 text-xl">get ready...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            {user ? (
                <Routes>
                    <Route path={HOME_PATH} element={<Home />} />
                    <Route path={CHAT_PATH} element={<Chat />} />
                    <Route path={PROFILE_PATH} element={<Profile />} />

                    {state?.role === "hero" && (
                        <>
                            <Route path={MY_SERVICE_PATH} element={<MyService />} />
                            <Route path={MY_JOB_PATH} element={<MyJob />} />
                            <Route path={`${SERVICE_HERO_PATH}/:id`} element={<DetailServiceHero />} />
                            <Route path={`${DETAIL_JOB_PATH}/:id`} element={<DetailJob />} />
                            <Route path={CREATE_SERVICE_PATH} element={<CreateService />} />
                        </>
                    )}

                    {state?.role === "owner" && (
                        <>
                            <Route path={MY_POST_PATH} element={<MyPost />} />
                            <Route path={MY_ASSIGNMENT_PATH} element={<MyAssignment />} />
                            <Route path={CREATE_POST_PATH} element={<CreatePost />} />
                            <Route path={`${DETAIL_POST_PATH}/:id`} element={<DetailPost />} />
                            <Route path={`${SERVICE_OWNER_PATH}/:id`} element={<DetailServiceOwner />} />
                            <Route path={`${DETAIL_POST_PATH}/:id/progress`} element={<PostProgress />} />
                        </>
                    )}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            ) : (
                <Routes>
                    <Route path={HOME_PATH} element={<Home />} />
                    <Route path={SIGN_IN_PATH} element={<SignIn />} />
                    <Route path={SIGN_UP_PATH} element={<SignUp />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            )}
        </BrowserRouter>
    );
}

export default App;
