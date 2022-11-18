import React, { useContext, useMemo, useState } from "react";

/* eslint-disable no-shadow */
import { Alert, Button, Card, Image, message, Modal, Skeleton, Space, Steps } from "antd";
import State from "components/common/state";
import { useMutation, useQuery, UseQueryResult } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import ownerService from "services/owner";
import userService from "services/user";
import { FINISH_WORK, IMAGE_FALLBACK } from "utils/constant";
import parser from "html-react-parser";
import Chip from "components/common/chip";
import moment from "moment";
import { Poster } from "models";
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

    const posterBidsQuery = useQuery(["bids", id], async () => {
        const bids = await heroService.GetPosterBid({ pid: id as any });
        return bids;
    });

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

    return (
        <div className="flex">
            <div className="flex-2">
                <Card className="">
                    <State data={userQuery.data} isLoading={userQuery.isLoading} isError={userQuery.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    <div className="w-full flex mb-5">
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
                                            <p className="m-0 text-gray-400 text-xs capitalize">programmer</p>
                                            {/* [IMPORTANT] ubah pekerjaan user nanti */}
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

                    <p className="m-0 capitalize font-semibold text-lg">
                        {fetcher.data?.title}{" "}
                        {myBid?.status === FINISH_WORK && (
                            <span className="m-0 text-green-300 capitalize font-normal text-sm ml-5">Completed ✅</span>
                        )}
                    </p>
                    <p className="font-medium m-0 mt-4">Owner: Fiqri ardiansyah</p>
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
                            {!myBid && !posterBidsQuery.isLoading && (
                                <ModalBid refetchQuery={refetchQuery} idPoster={id as any} isFixedPrice={!!fetcher.data?.is_fixed_price}>
                                    {(param) => (
                                        <Button type="primary" onClick={param.showModal}>
                                            Bid
                                        </Button>
                                    )}
                                </ModalBid>
                            )}
                        </div>
                        <br />
                        {myBid && (
                            <Card>
                                <div className="w-full flex items-center justify-between">
                                    <p className="capitalize font-semibold">bid letter</p>
                                    <p>{moment(myBid?.date).format("DD MMM yyyy, LT")}</p>
                                </div>
                                <div className="mt-5 text-gray-400 text-sm">{parser(myBid?.letter || "")}</div>
                            </Card>
                        )}
                    </>
                )}
            </div>
            {!posterBidsQuery.isLoading && myBid?.accept && (
                <div className="flex-1 ml-4">
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
                                <button
                                    disabled={userQuery.isLoading}
                                    className="cursor-pointer rounded-full w-10 h-10 bg-white border-solid border border-primary flex items-center justify-center"
                                    type="button"
                                >
                                    <FaTelegramPlane className="text-primary text-2xl" />
                                </button>
                            </Space>
                        </div>
                    </Card>
                    <br />
                    {myBid?.files && (
                        <Card>
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
            )}
        </div>
    );
}

export default JobTask;
