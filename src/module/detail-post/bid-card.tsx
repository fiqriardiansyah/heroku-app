/* eslint-disable no-shadow */
import { Alert, Button, Image, message, Skeleton, Space } from "antd";
import State from "components/common/state";
import moment from "moment";
import React from "react";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import ownerService from "services/owner";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import parser from "html-react-parser";
import { FaTelegramPlane, FaUserAlt } from "react-icons/fa";
import WarningModal from "components/modal/warning-modal";
import { ChatInfo, Poster } from "models";
import ButtonChat from "components/button/chat";
import Utils from "utils";
import authService from "services/auth";

type Props<T> = {
    fetcher: UseQueryResult<T, unknown>;
    biid: string;
};

function BidCard<T extends Poster>({ biid, fetcher }: Props<T>) {
    const user = authService.CurrentUser();

    const bidQuery = useQuery(["bid", biid], async () => {
        const bid = await ownerService.GetOneBid({ biid });
        return bid;
    });

    const isHeroFull = fetcher.data?.accepted_hero === fetcher.data?.number_of_hero;

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

    const acceptBidMutation = useMutation(
        async () => {
            if (isHeroFull) {
                throw new Error("Hero acceptance is full");
            }
            await ownerService.AcceptBidHero({ biid, data: fetcher.data as any });
        },
        {
            onSuccess: () => {
                fetcher.refetch();
                message.success("Hero on the way!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onAcceptWarningHandler = () => {
        acceptBidMutation.mutate();
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
                                {bidQuery.data?.price && (
                                    <p className="m-0 text-primary font-semibold mt-2">
                                        {parseInt(bidQuery.data?.price || "0", 10).ToIndCurrency("Rp")}
                                        <span className="text-gray-400 text-xs ml-2 font-normal capitalize">Bargain price</span>
                                    </p>
                                )}
                                <div className="break-words text-gray-500 text-sm my-3 bg-gray-100 p-2 px-4 rounded-md">
                                    {parser(bidQuery.data?.letter || "")}
                                </div>
                                <div className="w-full flex justify-end items-center">
                                    <Space>
                                        {bidQuery.data?.accept ? (
                                            <p className="text-green-400 m-0">You accept this hero</p>
                                        ) : (
                                            <WarningModal onOk={onAcceptWarningHandler}>
                                                {(dt) => (
                                                    <Button
                                                        disabled={isHeroFull}
                                                        loading={acceptBidMutation.isLoading}
                                                        type="primary"
                                                        onClick={dt.showModal}
                                                    >
                                                        Accept
                                                    </Button>
                                                )}
                                            </WarningModal>
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
                            <Alert message={(bidQuery.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>
        </div>
    );
}

export default BidCard;
