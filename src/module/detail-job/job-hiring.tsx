import React, { useContext } from "react";

/* eslint-disable no-shadow */
import { Alert, Button, Card, Image, Modal, Skeleton, Space } from "antd";
import State from "components/common/state";

import { useMutation, useQuery, UseQueryResult } from "react-query";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import parser from "html-react-parser";
import Chip from "components/common/chip";
import moment from "moment";
import { Poster } from "models";
import heroService from "services/hero";
import { useNavigate, useParams } from "react-router-dom";
import authService from "services/auth";
import InputFile from "components/form/inputs/input-file";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import ButtonFileDownload from "components/button/file-download";
import { FaTelegramPlane } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";
import { StateContext } from "context/state";
import { DETAIL_POST_PATH } from "utils/routes";
import ModalApplication from "./modal-application";

type Props<T> = {
    fetcher: UseQueryResult<T, unknown>;
    refetchQuery: () => void;
};

function JobHiring<T extends Poster>({ fetcher, refetchQuery }: Props<T>) {
    const navigate = useNavigate();

    const user = authService.CurrentUser();
    const { changeRole } = useContext(StateContext);

    const { id } = useParams();

    const userQuery = useMutation(async (uid: string) => {
        const usr = await userService.GetUser(uid);
        return usr;
    });

    const posterAppQuery = useQuery(["aplications", id], async () => {
        const applications = await heroService.GetPosterApplication({ pid: id as any });
        return applications;
    });

    const myApplication = (() => {
        if (posterAppQuery.isLoading) return null;
        if (!posterAppQuery.data) return null;
        return posterAppQuery.data?.find((app) => app.uid === user?.uid);
    })();

    const refetch = () => {
        posterAppQuery.refetch();
        refetchQuery();
    };

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

    return (
        <div className="">
            {myApplication?.accept && (
                <Card className="!mb-4">
                    <div className="w-full flex items-center justify-between">
                        <p className="capitalize font-semibold">Offering letter</p>
                        <p>{moment(myApplication?.offering_date).format("DD MMM yyyy, LT")}</p>
                    </div>
                    <div className="mt-5 text-gray-600 text-sm mb-3">{parser(myApplication?.offering_letter || "")}</div>
                    <Space direction="vertical">
                        {myApplication.files?.map((fl, i) => (
                            <ButtonFileDownload url={fl} name={`document-${i + 1}`} />
                        ))}
                    </Space>
                </Card>
            )}
            <Card>
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
                    {myApplication?.accept && <span className="m-0 text-green-300 capitalize font-normal text-sm ml-5">You got this job ✅</span>}
                </p>
                <p className="capitalize text-sm font-medium m-0">{fetcher.data?.company}</p>
                <p className="font-medium m-0 mt-4">Owner: Fiqri ardiansyah</p>
                <span className="text-gray-400 text-xs">Post {moment(fetcher.data?.date).format("DD MMM yyyy")}</span>
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
                    <div className="w-full flex items-center justify-between mt-5">
                        <p className="m-0 capitalize text-gray-400">{posterAppQuery.data?.length} People bid this post</p>
                        <Button onClick={onClickDetailHandler} type="link">
                            To Detail
                        </Button>
                    </div>
                )}
            </Card>
            {fetcher.data?.uid !== user?.uid && (
                <>
                    <div className="w-full flex items-center justify-between my-5">
                        <p className="m-0 capitalize text-gray-400">{posterAppQuery.data?.length} People apply this post</p>
                        <Space>
                            {!myApplication && !posterAppQuery.isLoading && (
                                <ModalApplication refetchQuery={refetch} idPoster={id as any}>
                                    {(param) => (
                                        <Button type="primary" onClick={param.showModal}>
                                            Apply
                                        </Button>
                                    )}
                                </ModalApplication>
                            )}
                            <button
                                disabled={userQuery.isLoading}
                                className="cursor-pointer rounded-full w-10 h-10 bg-white border-solid border border-primary flex items-center justify-center"
                                type="button"
                            >
                                <FaTelegramPlane className="text-primary text-2xl" />
                            </button>
                        </Space>
                    </div>
                    <br />
                    {myApplication && (
                        <Card>
                            <div className="w-full flex items-center justify-between">
                                <p className="capitalize font-semibold">Application letter</p>
                                <p>{moment(myApplication?.date).format("DD MMM yyyy, LT")}</p>
                            </div>
                            <div className="mt-5 text-gray-400 text-sm mb-3">{parser(myApplication?.description || "")}</div>
                            {myApplication.cv && <ButtonFileDownload url={myApplication.cv} name={`${user?.displayName}-CV`} />}
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}

export default JobHiring;
