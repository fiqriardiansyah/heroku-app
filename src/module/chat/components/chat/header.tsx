import React, { useContext } from "react";

import ProfileImage from "assets/images/profile.webp";
import { StateContext } from "context/state";
import { useQuery } from "react-query";
import userService from "services/user";
import SkeletonInput from "antd/lib/skeleton/Input";
import { Image, Spin } from "antd";
import { IMAGE_FALLBACK } from "utils/constant";
import { Link } from "react-router-dom";
import { BiLink } from "react-icons/bi";
import { DETAIL_JOB_PATH, DETAIL_POST_PATH, SERVICE_HERO_PATH, SERVICE_OWNER_PATH } from "utils/routes";
import { FaUserAlt } from "react-icons/fa";

function HeaderChat() {
    const { state } = useContext(StateContext);

    const userQuery = useQuery(
        [`get-user-${state?.chatActive?.uid}`],
        async () => {
            const req = await userService.GetUser(state?.chatActive?.uid as any);
            return req;
        },
        {
            enabled: !!state?.chatActive,
        }
    );

    const workLink = (() => {
        const servicePathname = state?.role === "hero" ? SERVICE_HERO_PATH : SERVICE_OWNER_PATH;
        const posterPathname = state?.role === "hero" ? DETAIL_JOB_PATH : DETAIL_POST_PATH;
        const url = state?.chatActive?.type_work === "service" ? servicePathname : posterPathname;
        return `${url}/${state?.chatActive?.anyid}`;
    })();

    return (
        <>
            <header className="w-full flex items-center p-2">
                <Image
                    preview={false}
                    referrerPolicy="no-referrer"
                    fallback={IMAGE_FALLBACK}
                    src={userQuery.data?.profile}
                    width={50}
                    height={50}
                    placeholder={
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                            <FaUserAlt className="text-2xl text-gray-400" />
                        </div>
                    }
                    className="flex-1 bg-gray-300 rounded-full object-cover"
                />
                <div className="flex flex-col ml-3">
                    {userQuery.isLoading ? (
                        <SkeletonInput active size="small" />
                    ) : (
                        <p className="m-0 capitalize font-semibold text-gray-700">{userQuery.data?.name}</p>
                    )}
                    <Link to={workLink}>
                        <p className="m-0 capitalize text-xs">
                            {state?.chatActive?.anytitle} <BiLink className="" />
                        </p>
                    </Link>
                </div>
            </header>
            <div className="w-full bg-slate-300" style={{ height: "1px" }} />
        </>
    );
}

export default HeaderChat;
