import { Image, Skeleton } from "antd";
import { ServiceData } from "models";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import { SERVICE_OWNER_PATH } from "utils/routes";

type Props = {
    data: ServiceData;
};

function Loading() {
    return (
        <div className="bg-gray-100 p-3 rounded-md">
            <Skeleton avatar paragraph={{ rows: 2 }} active />
            <Skeleton active paragraph={{ rows: 3 }} />
        </div>
    );
}

function ServiceCard({ data }: Props) {
    const userQuery = useQuery(
        [data.uid],
        async () => {
            const user = await userService.GetUser(data.uid!);
            return user;
        },
        {
            enabled: !!data.uid,
        }
    );

    return (
        <Link to={`${SERVICE_OWNER_PATH}/${data.id}`}>
            <div className="flex flex-col justify-center bg-gray-50 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                {userQuery.isLoading && <Skeleton avatar paragraph={{ rows: 2 }} />}
                {userQuery.data && (
                    <div className="m-4 mb-2 flex flex-row">
                        <Image
                            referrerPolicy="no-referrer"
                            preview={false}
                            fallback={IMAGE_FALLBACK}
                            loading="lazy"
                            className="rounded-full bg-gray-200 object-cover "
                            src={userQuery.data?.profile || undefined}
                            height={40}
                            width={40}
                            placeholder={
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                                    <FaUserAlt className="text-2xl text-gray-400" />
                                </div>
                            }
                        />
                        <div className="ml-3">
                            <p style={{ lineHeight: "100%" }} className="capitalize text-lg font-medium m-0 text-gray-900 dark:text-white">
                                {userQuery.data.name}
                            </p>
                            <span style={{ lineHeight: "7px" }} className="text-xs text-gray-400 capitalize">
                                analytic
                            </span>
                        </div>
                    </div>
                )}
                <div className="m-4 flex flex-col">
                    <Image
                        preview={false}
                        fallback={IMAGE_FALLBACK}
                        loading="lazy"
                        className="rounded-md bg-gray-200 object-cover "
                        src={data.poster_image || undefined}
                        height={150}
                    />
                    <br />
                    <p className="m-0 mb-2 text-gray-900 dark:text-white text-sm font-bold capitalize">{data.title}</p>
                    <p className="inline-flex py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                        {parseInt(data.price as string, 10).ToIndCurrency("Rp")}
                    </p>
                </div>
            </div>
        </Link>
    );
}

ServiceCard.Loading = Loading;

export default ServiceCard;
