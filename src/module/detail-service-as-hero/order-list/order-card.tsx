/* eslint-disable no-shadow */
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
    refetchService: () => void;
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

function OrderCard({ data, sid, refetchService, service }: Props) {
    const user = authService.CurrentUser();

    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (fl: File) => {
        setFile(fl);
    };

    const setJourneyMutation = useMutation(
        async (urlFile: string) => {
            await heroService.SetJourneyServiceOrder({ sid, order: data, urlFile });
        },
        {
            onSuccess: () => {
                refetchService();
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
                refetchService();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

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
            {setJourneyMutation.isError && <Alert message={(setJourneyMutation.error as any)?.message} type="error" />}
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
                <div className="w-full flex justify-between items-center mt-5">
                    <p className="text-gray-300 capitalize m-0 text-xs">If you have multiple file, you can archive those file first</p>
                    <Space>
                        {actions?.find((act) => act.status === data.status)?.button}
                        <ButtonChat chatInfo={chatInfo} disabled={!service || userQuery.isLoading} />
                    </Space>
                </div>
                <div className="w-full flex flex-col">
                    <Space direction="vertical">
                        {data.files
                            ?.filter((file) => file)
                            ?.map((fl, i) => (
                                <ButtonFileDownload url={fl} name={`document-${i + 1}`} />
                            ))}
                    </Space>
                </div>
            </div>
        </div>
    );
}

export default OrderCard;
