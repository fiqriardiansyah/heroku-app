/* eslint-disable no-shadow */
import { Alert, Button, Card, Collapse, Image, message, Skeleton, Space, Steps } from "antd";
import State from "components/common/state";
import moment from "moment";
import React, { useMemo } from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import ownerService from "services/owner";
import userService from "services/user";
import { FINISH_WORK, IMAGE_FALLBACK } from "utils/constant";
import parser from "html-react-parser";
import { FaTelegramPlane, FaUserAlt } from "react-icons/fa";
import { ChatInfo, Poster } from "models";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonFileDownload from "components/button/file-download";
import ButtonChat from "components/button/chat";
import Utils from "utils";
import authService from "services/auth";
import heroService from "services/hero";

type Props = {
    biid: string;
};

const { Panel } = Collapse;

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
        description: "Check work results",
        subTitle: "",
    },
];

function ProgressCard({ biid }: Props) {
    const user = authService.CurrentUser();

    const bidQuery = useQuery(["bid", biid], async () => {
        const bid = await ownerService.GetOneBid({ biid });
        return bid;
    });

    const posterQuery = useQuery(
        ["poster", bidQuery.data?.pid],
        async () => {
            const poster = await ownerService.GetOnePoster({ pid: bidQuery.data?.pid as any });
            return poster;
        },
        {
            enabled: !!bidQuery.data?.pid,
        }
    );

    const userQuery = useQuery(
        ["user", bidQuery.data?.uid],
        async () => {
            const usr = await userService.GetUser(bidQuery.data?.uid as any);
            return usr;
        },
        {
            enabled: !!bidQuery.data?.uid,
        }
    );

    const approveMutation = useMutation(
        async () => {
            await ownerService.ApproveTaskPoster({ data: bidQuery.data as any });
        },
        {
            onSuccess: () => {
                message.success("Thankyou for your order ❤️");
                bidQuery.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const mergeSteps = useMemo(() => {
        return steps.map((step, i) => {
            const date = (() => {
                if (bidQuery.data?.progress) {
                    if (bidQuery.data.progress[i]) return bidQuery.data.progress[i].date;
                    return "";
                }
                return "";
            })();
            return {
                ...step,
                subTitle: date,
            };
        });
    }, [bidQuery.data]);

    const actions = [
        {
            status: 3,
            button: (
                <Button
                    loading={approveMutation.isLoading}
                    disabled={approveMutation.isLoading}
                    onClick={() => approveMutation.mutate()}
                    type="primary"
                >
                    Approve
                </Button>
            ),
        },
    ];

    const chatId = Utils.createChatId({ uids: [user?.uid as any, userQuery.data?.uid as any], postfix: posterQuery.data?.id as any });
    const chatInfo: ChatInfo = {
        anyid: posterQuery.data?.id as any,
        anytitle: posterQuery.data?.title as any,
        type_work: "poster",
        uid: userQuery.data?.uid as any,
        cid: chatId,
        id: chatId,
    };

    return (
        <Card className="!mb-4">
            <State data={bidQuery.data} isLoading={bidQuery.isLoading} isError={bidQuery.isError}>
                {(state) => (
                    <>
                        <State.Data state={state}>
                            <div className="w-full">
                                <div className="w-full items-start justify-between flex">
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
                                                            {userQuery.data?.profession && (
                                                                <p className="m-0 text-gray-400 text-xs capitalize">{userQuery.data?.profession}</p>
                                                            )}
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
                                    <p>{moment(bidQuery.data?.date).format("DD MMM yyyy, LT")}</p>
                                </div>
                                <Collapse ghost>
                                    <Panel header="Letter" key="1">
                                        <div className="break-words text-gray-500 text-sm my-3 bg-gray-100 p-2 px-4 rounded-md">
                                            {parser(bidQuery.data?.letter || "")}
                                        </div>
                                    </Panel>
                                </Collapse>
                                <div className="px-5 my-4">
                                    <p className="capitalize font-semibold">progress</p>
                                    <Steps current={bidQuery.data?.status}>
                                        {mergeSteps.map((step) => (
                                            <Steps.Step
                                                key={step.title}
                                                title={step.title}
                                                description={step.description}
                                                subTitle={step.subTitle ? moment(step.subTitle).format("DD MMM, LT") : ""}
                                            />
                                        ))}
                                    </Steps>
                                </div>
                                <div className="w-full flex justify-between items-start">
                                    {(!bidQuery.data?.files || !bidQuery.data.files.find((f) => f)) && <p />}
                                    <Space direction="vertical">
                                        {bidQuery.data?.files
                                            ?.filter((file) => file)
                                            ?.map((fl, i) => (
                                                <ButtonFileDownload url={fl} name={`document-${i + 1}`} />
                                            ))}
                                    </Space>
                                    <Space>
                                        {actions?.find((act) => act.status === bidQuery.data?.status)?.button}
                                        <ButtonChat chatInfo={chatInfo} disabled={posterQuery.isLoading || userQuery.isLoading} />
                                    </Space>
                                </div>
                                {bidQuery.data?.status === FINISH_WORK && (
                                    <p className="m-0 text-green-300 capitalize mt-2">the work has been completed by the hero, thank you 😁</p>
                                )}
                            </div>
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 3 }} avatar />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(bidQuery.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>
        </Card>
    );
}

export default ProgressCard;
