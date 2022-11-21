/* eslint-disable no-nested-ternary */
import { Alert, Image, Skeleton, Space, Button, Modal, message, Steps } from "antd";
import State from "components/common/state";
import { ChatInfo, IDs, ServiceDetail, ServiceOrder, ServiceRequest } from "models";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { FaTelegramPlane, FaUserAlt } from "react-icons/fa";
import { AiFillFile } from "react-icons/ai";
import { IoMdWarning } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import authService from "services/auth";
import heroService from "services/hero";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import InputFile from "components/form/inputs/input-file";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import fileService from "services/file";
import ButtonFileDownload from "components/button/file-download";
import ButtonChat from "components/button/chat";
import Utils from "utils";

type Props = Pick<IDs, "sid"> & {
    data: ServiceOrder;
    service: ServiceDetail | undefined;
};

const steps = [
    {
        title: "Start",
        description: "Starting on project",
        subTitle: "",
    },
    {
        title: "Processing",
        description: "In the process of services",
        subTitle: "",
    },
    {
        title: "Deliver",
        description: "Send work",
        subTitle: "",
    },
    {
        title: "Checking",
        description: "Wait for check work results",
        subTitle: "",
    },
];

function FinishCard({ data, sid, service }: Props) {
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

    const mergeSteps = useMemo(() => {
        return steps.map((step, i) => {
            const date = (() => {
                if (data.progress) {
                    if (data.progress[i]) return data.progress[i].date;
                    return "";
                }
                return "";
            })();
            return {
                ...step,
                subTitle: date,
            };
        });
    }, [data]);

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
            <div className="w-full items-center flex justify-between mt-6 flex-col">
                <Steps size="small" current={data.status}>
                    {mergeSteps.map((step) => (
                        <Steps.Step
                            key={step.title}
                            title={step.title}
                            description={step.description}
                            subTitle={step.subTitle ? moment(step.subTitle).format("DD MMM, LT") : ""}
                        />
                    ))}
                </Steps>
                <div className="w-full flex justify-between items-start mt-5">
                    <div className=" flex flex-col">
                        <Space direction="vertical">
                            {data.files?.map((fl, i) => {
                                if (!fl) return null;
                                return <ButtonFileDownload url={fl} name={`document-${i + 1}`} />;
                            })}
                        </Space>
                    </div>
                    <ButtonChat chatInfo={chatInfo} disabled={!service || userQuery.isLoading} />
                </div>
            </div>
        </div>
    );
}

export default FinishCard;
