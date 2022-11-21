import React, { useContext, useMemo, useState } from "react";

/* eslint-disable no-shadow */
import { Affix, Alert, Button, Card, Image, message, Modal, Skeleton, Space, Steps } from "antd";
import State from "components/common/state";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import ownerService from "services/owner";
import userService from "services/user";
import { FINISH_WORK, IMAGE_FALLBACK } from "utils/constant";
import parser from "html-react-parser";
import Chip from "components/common/chip";
import moment from "moment";
import { ChatInfo, Poster } from "models";
import heroService from "services/hero";
import authService from "services/auth";
import { IoMdWarning } from "react-icons/io";
import { StateContext } from "context/state";
import { DETAIL_POST_PATH } from "utils/routes";
import InputFile from "components/form/inputs/input-file";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import { AiFillFile } from "react-icons/ai";
import fileService from "services/file";
import { FaTelegramPlane } from "react-icons/fa";
import ButtonFileDownload from "components/button/file-download";
import ButtonChat from "components/button/chat";
import Utils from "utils";
import ModalBid from "./modal-bid";

type Props<T> = {
    fetcher: UseQueryResult<T, unknown>;
    refetchQuery: () => void;
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
        description: "Check work results",
        subTitle: "",
    },
];

function JobTask<T extends Poster>({ fetcher, refetchQuery }: Props<T>) {
    const { changeRole } = useContext(StateContext);
    const user = authService.CurrentUser();
    const { id } = useParams();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);

    const userQuery = useMutation(async (uid: string) => {
        const usr = await userService.GetUser(uid);
        return usr;
    });

    const posterBidsQuery = useQuery(
        ["bids", id],
        async () => {
            const bids = await heroService.GetPosterBid({ pid: id as any });
            return bids;
        },
        {
            onSuccess: () => {
                if (!userQuery.data) {
                    userQuery.mutate(fetcher.data?.uid as any);
                }
            },
        }
    );

    const myBid = (() => {
        if (posterBidsQuery.isLoading) return null;
        if (!posterBidsQuery.data) return null;
        return posterBidsQuery.data?.find((bid) => bid.uid === user?.uid);
    })();

    const handleFileChange = (fl: File) => {
        setFile(fl);
    };

    const setJourneyMutation = useMutation(
        async (urlFile: string) => {
            await heroService.SetJourneyPoster({ urlFile, data: myBid! });
        },
        {
            onSuccess: () => {
                fetcher.refetch();
                posterBidsQuery.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const uploadFileMutation = useMutation(
        async (fl: File) => {
            const ref = await fileService.UploadFileAndGetDownloadUrl(fl);
            setJourneyMutation.mutate(ref.toString());
        },
        {
            onSuccess: () => {
                fetcher.refetch();
                posterBidsQuery.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onClickDetailHandler = () => {
        Modal.confirm({
            title: "Switch?",
            icon: <IoMdWarning className="text-yellow-400" />,
            content: `You need switch role to get to your detail post, switch?`,
            onOk() {
                if (changeRole) {
                    changeRole();
                    navigate(`${DETAIL_POST_PATH}/${fetcher.data?.id}`);
                }
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

    const actions = [
        {
            status: 0,
            button: (
                <Button
                    loading={setJourneyMutation.isLoading}
                    disabled={setJourneyMutation.isLoading}
                    onClick={() => setJourneyMutation.mutate("")}
                    type="primary"
                >
                    Process
                </Button>
            ),
        },
        {
            status: 1,
            button: (
                <Button
                    loading={setJourneyMutation.isLoading}
                    disabled={setJourneyMutation.isLoading}
                    onClick={() => setJourneyMutation.mutate("")}
                    type="primary"
                >
                    Finish
                </Button>
            ),
        },
        {
            status: 2,
            button: (
                <Space>
                    <InputFile handleChange={handleFileChange} name="document" types={["png", "jpg", "jpeg", "pdf", "zip", "doc", "rar"]}>
                        <div className="bg-gray-200 capitalize border border-solid border-gray-300 rounded-md px-4 py-1 cursor-pointer">
                            <EllipsisMiddle suffixCount={10}>{file ? file.name : "drop or click"}</EllipsisMiddle>
                        </div>
                    </InputFile>
                    <Button
                        onClick={() => uploadFileMutation.mutate(file!)}
                        loading={setJourneyMutation.isLoading || uploadFileMutation.isLoading}
                        disabled={setJourneyMutation.isLoading || !file || uploadFileMutation.isLoading}
                        type="primary"
                        icon={<AiFillFile />}
                    >
                        Submit
                    </Button>
                </Space>
            ),
        },
    ];

    const mergeSteps = useMemo(() => {
        return steps.map((step, i) => {
            const date = (() => {
                if (myBid?.progress) {
                    if (myBid.progress[i]) return myBid.progress[i].date;
                    return "";
                }
                return "";
            })();
            return {
                ...step,
                subTitle: date,
            };
        });
    }, [myBid]);

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
        <div className="flex flex-wrap-reverse md:flex-nowrap">
            <div className="flex-1 md:w-2/3 md:mt-0 mt-3">
                <Card className="">
                    <p className="m-0 capitalize font-semibold text-lg">
                        {fetcher.data?.title}{" "}
                        {myBid?.status === FINISH_WORK && (
                            <span className="m-0 text-green-300 capitalize font-normal text-sm ml-5">Completed ✅</span>
                        )}
                    </p>
                    <p className="font-medium m-0 mt-4 capitalize">Owner: {userQuery.data?.name || ""}</p>
                    <span className="text-gray-400 text-xs">Post {moment(fetcher.data?.date).format("DD MMM yyyy")}</span>
                    <p className="m-0">
                        {fetcher.data?.is_fixed_price ? "Fixed" : "Bargain"} price - {parseInt(fetcher.data?.price as string, 10).ToIndCurrency("Rp")}
                    </p>
                    <div className="my-4">{parser(fetcher.data?.description || "")}</div>
                    <div className="mb-4">
                        <p className="capitalize font-medium m-0">type of job</p>
                        <p className="capitalize text-gray-400 text-sm m-0">{fetcher.data?.type_of_job}</p>
                    </div>
                    <div className="w-full flex">
                        <div className="flex-1">
                            <p className="capitalize font-medium">category</p>
                            <Chip text={fetcher.data?.category} />
                        </div>
                        <div className="flex-1">
                            <p className="capitalize font-medium">skills</p>
                            <div className="flex flex-wrap gap-2">
                                {fetcher.data?.skills?.map((skill) => (
                                    <Chip text={skill} key={skill} />
                                ))}
                            </div>
                        </div>
                    </div>
                    {fetcher.data?.uid === user?.uid && (
                        <div className="w-full flex items-center justify-between my-5">
                            <p className="m-0 capitalize text-gray-400">{posterBidsQuery.data?.length} People bid this post</p>
                            <Button onClick={onClickDetailHandler} type="link">
                                To Detail
                            </Button>
                        </div>
                    )}
                </Card>
                {fetcher.data?.uid !== user?.uid && (
                    <>
                        <div className="w-full flex items-center justify-between my-5">
                            <p className="m-0 capitalize text-gray-400">{posterBidsQuery.data?.length} People bid this post</p>
                            <Space>
                                {!myBid && !posterBidsQuery.isLoading && (
                                    <ModalBid refetchQuery={refetchQuery} idPoster={id as any} isFixedPrice={!!fetcher.data?.is_fixed_price}>
                                        {(param) => (
                                            <Button type="primary" onClick={param.showModal}>
                                                Bid
                                            </Button>
                                        )}
                                    </ModalBid>
                                )}
                                <ButtonChat chatInfo={chatInfo} disabled={userQuery.isLoading} />
                            </Space>
                        </div>
                        <br />
                        {myBid && (
                            <Card>
                                <div className="w-full flex items-start justify-between">
                                    <div className="">
                                        <p className="capitalize font-semibold m-0">bid letter</p>
                                        {myBid?.price && (
                                            <p className="capitalize m-0 text-xs font-normal">Bid: {parseInt(myBid.price, 10).ToIndCurrency("Rp")}</p>
                                        )}
                                    </div>
                                    <p>{moment(myBid?.date).format("DD MMM yyyy, LT")}</p>
                                </div>
                                <div className="mt-5 text-gray-400 text-sm">{parser(myBid?.letter || "")}</div>
                            </Card>
                        )}
                    </>
                )}
            </div>
            {!posterBidsQuery.isLoading && myBid?.accept && (
                <div className="w-full md:w-1/3 md:ml-4">
                    <div className="md:sticky md:top-20">
                        <Card>
                            <p className="capitalize font-semibold">status</p>
                            <Steps current={myBid?.status} direction="vertical">
                                {mergeSteps.map((step) => (
                                    <Steps.Step
                                        key={step.title}
                                        title={step.title}
                                        description={step.description}
                                        subTitle={step.subTitle ? moment(step.subTitle).format("DD MMM, LT") : ""}
                                    />
                                ))}
                            </Steps>
                            <p className="text-gray-300 capitalize m-0 text-xs">If you have multiple file, you can archive those file first</p>
                            <div className="w-full flex justify-end items-center mt-2">
                                <Space>
                                    {actions?.find((act) => act.status === myBid?.status)?.button}
                                    <ButtonChat chatInfo={chatInfo} disabled={userQuery.isLoading} />
                                </Space>
                            </div>
                        </Card>
                        <br />
                        {myBid?.files && (
                            <Card>
                                <p className="capitalize font-semibold">Files</p>
                                <Space direction="vertical">
                                    {myBid?.files
                                        ?.filter((file) => file)
                                        ?.map((fl, i) => (
                                            <ButtonFileDownload url={fl} name={`document-${i + 1}`} />
                                        ))}
                                </Space>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobTask;
