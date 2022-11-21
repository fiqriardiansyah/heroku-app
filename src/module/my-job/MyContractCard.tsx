import { Alert, Button, Card, Collapse, message, Skeleton, Space, Steps } from "antd";
import State from "components/common/state";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import InputFile from "components/form/inputs/input-file";
import { Application, Bid, ChatInfo } from "models";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { AiFillFile } from "react-icons/ai";
import { BiLink } from "react-icons/bi";
import { FaTelegramPlane } from "react-icons/fa";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import fileService from "services/file";
import heroService from "services/hero";
import userService from "services/user";
import { DETAIL_JOB_PATH } from "utils/routes";
import parser from "html-react-parser";
import { FINISH_WORK } from "utils/constant";
import ButtonChat from "components/button/chat";
import Utils from "utils";
import authService from "services/auth";

interface Props {
    application: Application;
}
interface MyJobHeaderData {
    owner: string | undefined;
    created: any | undefined;
    company?: any;
}

function MyJobHeader({ owner, created, company }: MyJobHeaderData) {
    return (
        <div>
            {company && <p className="mb-0 font-medium">{company}</p>}
            <p className="mb-0 text-12 sm:text-sm">{`Owner: ${owner}`}</p>
            <p className="text-10 sm:text-12 text-gray-400">{`Post: ${created}`}</p>
        </div>
    );
}

function MyContractCard({ application }: Props) {
    const user = authService.CurrentUser();
    const { Panel } = Collapse;

    const userQuery = useMutation(async (uid: string) => {
        const usr = await userService.GetUser(uid);
        return usr;
    });

    const posterQuery = useQuery(
        ["poster", application.pid],
        async () => {
            const poster = await heroService.GetOnePoster({ pid: application.pid });
            return poster;
        },
        {
            onSuccess: (poster) => {
                if (!userQuery.data) {
                    userQuery.mutate(poster.uid as any);
                }
            },
        }
    );

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
        <Card>
            <State data={posterQuery.data} isLoading={posterQuery.isLoading} isError={posterQuery.isError}>
                {(state) => (
                    <>
                        <State.Data state={state}>
                            <div className="flex justify-between sm:text-16 font-medium">
                                <Link className="text-black hover:text-blue-900" to={`${DETAIL_JOB_PATH}/${posterQuery.data?.id}`}>
                                    <div className="m-0">
                                        {posterQuery.data?.title} <BiLink />
                                        {application.accept && <span className="text-green-400 capitalize ml-4 text-xs">you got this job ✅</span>}
                                    </div>
                                </Link>
                            </div>
                            <Collapse ghost>
                                <Panel
                                    style={{ padding: "0px" }}
                                    header={<MyJobHeader owner={userQuery.data?.name} created={moment(application.date).format("DD MMM yyyy, LT")} />}
                                    key={1}
                                >
                                    <div className="my-4 px-5 ">
                                        {application.accept ? (
                                            <div className="flex flex-col items-center">
                                                <h1 className="capitalize font-semibold text-2xl">congratulations!</h1>
                                                <p className="capitalize ">you got this job</p>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 rounded-md p-3">{parser(application.description)}</div>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <ButtonChat chatInfo={chatInfo} disabled={posterQuery.isLoading || userQuery.isLoading} />
                                    </div>
                                </Panel>
                            </Collapse>
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 2 }} avatar active />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(posterQuery.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>
        </Card>
    );
}

export default MyContractCard;
