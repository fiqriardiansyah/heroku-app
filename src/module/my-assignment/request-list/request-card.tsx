import { Alert, Card, Image, Skeleton } from "antd";
import State from "components/common/state";
import { ServiceOwnerRequest } from "models";
import { BiLink } from "react-icons/bi";
import moment from "moment";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import ownerService from "services/owner";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import { SERVICE_OWNER_PATH } from "utils/routes";
import { FaTelegramPlane } from "react-icons/fa";
import Lottie from "react-lottie";
import JsonWaitingAnim from "assets/animation/waiting.json";

type Props = {
    data: ServiceOwnerRequest;
};

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: JsonWaitingAnim,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

function RequestCard({ data }: Props) {
    const userQuery = useQuery(
        ["user", data.uid],
        async () => {
            const usr = await userService.GetUser(data.uid as any);
            return usr;
        },
        {
            enabled: !!data.uid,
        }
    );

    const serviceQuery = useQuery(
        ["service", data.sid],
        async () => {
            const service = ownerService.GetOneService({ sid: data.sid });
            return service;
        },
        {
            enabled: !!data.uid,
        }
    );

    return (
        <Card className="flex flex-col">
            <State data={userQuery.data} isLoading={userQuery.isLoading} isError={userQuery.isError}>
                {(state) => (
                    <>
                        <State.Data state={state}>
                            <div className="w-full flex">
                                <Image
                                    preview={false}
                                    referrerPolicy="no-referrer"
                                    fallback={IMAGE_FALLBACK}
                                    src={userQuery.data?.profile}
                                    width={40}
                                    height={40}
                                    className="flex-1 bg-gray-300 rounded-full object-cover"
                                />
                                <div className="flex flex-col ml-3">
                                    <p className="m-0 font-semibold text-gray-500 capitalize">{userQuery.data?.name}</p>
                                    <Link to={`${SERVICE_OWNER_PATH}/${data.uid}/${data.sid}`}>
                                        <p className="m-0 text-blue-300 capitalize text-sm">
                                            {serviceQuery.data?.title} <BiLink />
                                        </p>
                                    </Link>
                                    <p className="m-0 text-gray-400 text-xs capitalize">{moment(data.date).format("DD MMM yyyy, LT")}</p>
                                </div>
                            </div>
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 2 }} avatar />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(userQuery.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>
            <div className="flex flex-col items-center justify-center my-5">
                {data.status === "waiting" && (
                    <>
                        <Lottie isClickToPauseDisabled options={defaultOptions} height={100} width={100} />
                        <p className="capitalize text-gray-400 font-semibold">Waiting for request to hero...</p>
                    </>
                )}
                {data.status === "rejected" && <p className="text-red-400 capitalize">your request was rejected by the hero</p>}
            </div>
            <button
                disabled={userQuery.isLoading}
                className="cursor-pointer justify-self-end rounded-full w-10 h-10 bg-white border-solid border border-primary flex items-center justify-center"
                type="button"
            >
                <FaTelegramPlane className="text-primary text-2xl" />
            </button>
        </Card>
    );
}

export default RequestCard;
