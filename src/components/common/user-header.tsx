import { Alert, Image, Skeleton } from "antd";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { useQuery } from "react-query";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import State from "./state";

type Props = {
    uid: string;
};

function UserHeader({ uid }: Props) {
    const userQuery = useQuery(
        ["user", uid],
        async () => {
            const usr = await userService.GetUser(uid as any);
            return usr;
        },
        {
            enabled: !!uid,
        }
    );

    return (
        <State data={userQuery.data} isLoading={userQuery.isLoading} isError={userQuery.isError}>
            {(state) => (
                <>
                    <State.Data state={state}>
                        <div className="flex">
                            <Image
                                preview={false}
                                referrerPolicy="no-referrer"
                                fallback={IMAGE_FALLBACK}
                                src={userQuery.data?.profile}
                                width={40}
                                height={40}
                                placeholder={
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                                        <FaUserAlt className="text-2xl text-gray-400" />
                                    </div>
                                }
                                className="flex-1 bg-gray-300 rounded-full object-cover"
                            />
                            <div className="flex flex-col ml-3">
                                <p className="m-0 font-semibold text-gray-500 capitalize">{userQuery.data?.name}</p>
                                {userQuery.data?.profession && <p className="m-0 text-gray-400 text-xs capitalize">{userQuery.data?.profession}</p>}
                            </div>
                        </div>
                    </State.Data>
                    <State.Loading state={state}>
                        <Skeleton paragraph={{ rows: 1 }} avatar />
                    </State.Loading>
                    <State.Error state={state}>
                        <Alert message={(userQuery.error as any)?.message} type="error" />
                    </State.Error>
                </>
            )}
        </State>
    );
}

export default UserHeader;
