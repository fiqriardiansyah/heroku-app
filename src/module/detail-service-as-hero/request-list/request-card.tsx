import { Alert, Image, Skeleton, Space, Button, Modal, message } from "antd";
import ButtonChat from "components/button/chat";
import State from "components/common/state";
import { ChatInfo, IDs, ServiceDetail, ServiceRequest } from "models";
import moment from "moment";
import React from "react";
import { FaTelegramPlane, FaUserAlt } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import authService from "services/auth";
import heroService from "services/hero";
import userService from "services/user";
import Utils from "utils";
import { IMAGE_FALLBACK } from "utils/constant";

type Props = Pick<IDs, "sid"> & {
    data: ServiceRequest;
    service: ServiceDetail | undefined;
    refetchService: () => void;
};

function RequestCard({ data, sid, refetchService, service }: Props) {
    const user = authService.CurrentUser();

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

    const acceptMutation = useMutation(
        async (callback: () => void) => {
            await heroService.AcceptRequestService({ sid, uid: data?.uid as any, request: data, hid: data.hid });
            callback();
        },
        {
            onSuccess: () => {
                message.success("Request Accepted");
                refetchService();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const declineMutation = useMutation(
        async (callback: () => void) => {
            await heroService.DeclineRequestService({ sid, request: data });
            callback();
        },
        {
            onSuccess: () => {
                message.success("Request Declined!");
                refetchService();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onAcceptClickHandler = () => {
        Modal.confirm({
            title: "Accept",
            icon: <IoMdWarning className="text-yellow-400" />,
            content: `Accept request from ${userQuery.data?.name}`,
            onOk() {
                return new Promise((resolve, reject) => {
                    acceptMutation.mutate(() => {
                        resolve(true);
                    });
                });
            },
            onCancel() {},
            cancelButtonProps: {
                type: "text",
            },
        });
    };

    const onDeclineClickHandler = () => {
        Modal.confirm({
            title: "Decline",
            icon: <IoMdWarning className="text-red-400" />,
            content: `Are you sure to remove request from ${userQuery.data?.name}`,
            onOk() {
                return new Promise((resolve, reject) => {
                    declineMutation.mutate(() => {
                        resolve(true);
                    });
                });
            },
            onCancel() {},
            okButtonProps: {
                danger: true,
            },
            cancelButtonProps: {
                type: "text",
            },
        });
    };

    const chatId = Utils.createChatId({ uids: [user?.uid as any, userQuery.data?.uid as any], postfix: service?.id as any });
    const chatInfo: ChatInfo = {
        anyid: service?.id as any,
        anytitle: service?.title as any,
        type_work: "service",
        uid: userQuery.data?.uid as any,
        cid: chatId,
        id: chatId,
    };

    return (
        <div className="w-full flex flex-col p-4" style={{ borderBottom: "1px solid #c1c0c0" }}>
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
                                    placeholder={
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                                            <FaUserAlt className="text-2xl text-gray-400" />
                                        </div>
                                    }
                                    className="flex-1 bg-gray-300 rounded-full object-cover"
                                />
                                <div className="flex flex-col ml-3">
                                    <p className="m-0 font-semibold text-gray-500 capitalize">{userQuery.data?.name}</p>
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
            <div className="w-full items-center flex justify-between mt-6">
                <Space>
                    <Button onClick={onAcceptClickHandler} type="primary">
                        Accept
                    </Button>
                    <Button onClick={onDeclineClickHandler} type="text" danger>
                        Decline
                    </Button>
                </Space>
                <ButtonChat chatInfo={chatInfo} disabled={!service || userQuery.isLoading} />
            </div>
        </div>
    );
}

export default RequestCard;
