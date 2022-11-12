import React, { useContext } from "react";

import ProfileImage from "assets/images/profile.webp";
import { StateContext } from "context/state";
import { useQuery } from "react-query";
import userService from "services/user";
import SkeletonInput from "antd/lib/skeleton/Input";
import { Image, Spin } from "antd";
import { IMAGE_FALLBACK } from "utils/constant";

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
                        <div className="w-full h-full flex items-center justify-center">
                            <Spin />
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
                    <p className="m-0 capitalize text-xs">{state?.chatActive?.anytitle}</p>
                </div>
            </header>
            <div className="w-full bg-slate-300" style={{ height: "1px" }} />
        </>
    );
}

export default HeaderChat;
