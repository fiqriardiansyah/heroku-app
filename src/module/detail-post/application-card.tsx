/* eslint-disable no-shadow */
import { Alert, Button, Collapse, Image, message, Skeleton, Space } from "antd";
import State from "components/common/state";
import moment from "moment";
import React from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import ownerService from "services/owner";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import parser from "html-react-parser";
import { FaTelegramPlane, FaUserAlt } from "react-icons/fa";
import { ChatInfo, Poster } from "models";
import ButtonFileDownload from "components/button/file-download";
import OfferingModal from "components/modal/offering-modal";
import { useParams } from "react-router-dom";
import ButtonChat from "components/button/chat";
import Utils from "utils";
import authService from "services/auth";

type Props<T> = {
    fetcher: UseQueryResult<T, unknown>;
    apcid: string;
};

function ApplicationCard<T extends Poster>({ apcid, fetcher }: Props<T>) {
    const user = authService.CurrentUser();
    const applicationQuery = useQuery(["bid", apcid], async () => {
        const app = await ownerService.GetOneApplication({ apcid });
        return app;
    });

    const isHeroFull = fetcher.data?.accepted_hero === fetcher.data?.limit_applicant;

    const userQuery = useQuery(
        ["user", applicationQuery.data?.uid],
        async () => {
            const usr = await userService.GetUser(applicationQuery.data?.uid as any);
            return usr;
        },
        {
            enabled: !!applicationQuery.data?.uid,
        }
    );

    const refetch = () => {
        fetcher.refetch();
        applicationQuery.refetch();
    };

    const chatId = Utils.createChatId({ uids: [user?.uid as any, userQuery.data?.uid as any], postfix: fetcher.data?.id as any });
    const chatInfo: ChatInfo = {
        anyid: fetcher.data?.id as any,
        anytitle: fetcher.data?.title as any,
        type_work: "poster",
        uid: userQuery.data?.uid as any,
        cid: chatId,
        id: chatId,
    };

    return (
        <div className="w-full pb-2 mb-4" style={{ borderBottom: "1px solid #e3e3e3" }}>
            <State data={applicationQuery.data} isLoading={applicationQuery.isLoading} isError={applicationQuery.isError}>
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
                                    <p>{moment(applicationQuery.data?.date).format("DD MMM yyyy, LT")}</p>
                                </div>
                                <div className="break-words text-gray-500 text-sm my-3 bg-gray-100 p-2 px-4 rounded-md">
                                    {parser(applicationQuery.data?.description || "")}
                                </div>
                                {applicationQuery.data?.accept && (
                                    <Collapse ghost>
                                        <Collapse.Panel header="Offering letter" key="1">
                                            <div className="break-words text-gray-500 text-sm my-3 bg-gray-100 p-2 px-4 rounded-md">
                                                {parser(applicationQuery.data?.offering_letter || "")}
                                                <Space direction="vertical">
                                                    {applicationQuery.data?.files?.map((fl, i) => (
                                                        <ButtonFileDownload url={fl} name={`document-${i + 1}`} />
                                                    ))}
                                                </Space>
                                            </div>
                                        </Collapse.Panel>
                                    </Collapse>
                                )}
                                <div className="w-full flex justify-between items-center">
                                    {!applicationQuery.data?.cv && <p />}
                                    {applicationQuery.data?.cv && <ButtonFileDownload url={applicationQuery.data?.cv} name="CV" />}
                                    <Space>
                                        {applicationQuery.data?.accept ? (
                                            <p className="text-green-400 m-0">Hired</p>
                                        ) : (
                                            <OfferingModal
                                                poster={fetcher.data as any}
                                                idApplication={applicationQuery.data?.id as any}
                                                refetchQuery={refetch}
                                            >
                                                {(dt) => (
                                                    <Button disabled={isHeroFull} type="primary" onClick={dt.showModal}>
                                                        Hire
                                                    </Button>
                                                )}
                                            </OfferingModal>
                                        )}
                                        <ButtonChat chatInfo={chatInfo} disabled={userQuery.isLoading} />
                                    </Space>
                                </div>
                            </div>
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 3 }} avatar />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(applicationQuery.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>
        </div>
    );
}

export default ApplicationCard;
