/* eslint-disable no-shadow */
import Layout from "components/common/layout";
import React, { Children, useContext, useState } from "react";
import { Alert, Button, Card, Image, message, Modal, Skeleton, Space } from "antd";
import parser from "html-react-parser";
import { useNavigate, useParams } from "react-router-dom";
import { CHAT_PATH, MY_ASSIGNMENT_PATH, SERVICE_HERO_PATH } from "utils/routes";
import { FaTelegramPlane, FaUserAlt } from "react-icons/fa";
import { useMutation, useQuery } from "react-query";
import ownerService from "services/owner";
import State from "components/common/state";
import { IMAGE_FALLBACK } from "utils/constant";
import Chip from "components/common/chip";
import ButtonFileDownload from "components/button/file-download";
import WarningModal from "components/modal/warning-modal";
import { ChatInfo, ServiceDetail } from "models";
import authService from "services/auth";
import { IoMdWarning } from "react-icons/io";
import { StateContext } from "context/state";
import userService from "services/user";
import ButtonChat from "components/button/chat";
import Utils from "utils";

function DetailServiceOwner() {
    const navigate = useNavigate();
    const { changeRole } = useContext(StateContext);

    const user = authService.CurrentUser();
    const { id } = useParams();

    const serviceQuery = useQuery(
        ["service", id],
        async () => {
            const serviceDetail = await ownerService.GetDetailService({ sid: id as any });
            return serviceDetail;
        },
        {
            enabled: !!id,
        }
    );

    const userQuery = useQuery(
        ["user", serviceQuery.data?.uid],
        async () => {
            const usr = await userService.GetUser(serviceQuery.data?.uid as any);
            return usr;
        },
        {
            enabled: !!serviceQuery.data?.uid,
        }
    );

    const orderServiceMutation = useMutation(
        async (service: ServiceDetail) => {
            await ownerService.OrderService({ sid: service.id as any, hid: service.uid as any, uid: user?.uid as any });
        },
        {
            onSuccess: () => {
                message.success("The request will be submitted to the hero");
                navigate(MY_ASSIGNMENT_PATH);
            },
        }
    );

    const onAcceptWarningHandler = () => {
        if (!serviceQuery.data) return;
        orderServiceMutation.mutate(serviceQuery.data);
    };

    const onClickDetailHandler = () => {
        Modal.confirm({
            title: "Switch?",
            icon: <IoMdWarning className="text-yellow-400" />,
            content: `You need switch role to get to your detail service, switch?`,
            onOk() {
                if (changeRole) {
                    changeRole();
                    navigate(`${SERVICE_HERO_PATH}/${serviceQuery.data?.id}`);
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

    const chatId = Utils.createChatId({ uids: [user?.uid as any, userQuery.data?.uid as any], postfix: serviceQuery.data?.id as any });
    const chatInfo: ChatInfo = {
        anyid: serviceQuery.data?.id as any,
        anytitle: serviceQuery.data?.title as any,
        type_work: "service",
        uid: userQuery.data?.uid as any,
        cid: chatId,
        id: chatId,
    };

    return (
        <Layout>
            <br />
            {orderServiceMutation.isError && <Alert message={(orderServiceMutation.error as any)?.message} type="error" />}
            <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-2">
                    <State data={serviceQuery.data} isLoading={serviceQuery.isLoading} isError={serviceQuery.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    <div className="w-full">
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
                                                                    <p className="m-0 text-gray-400 text-xs capitalize">
                                                                        {userQuery.data?.profession}
                                                                    </p>
                                                                )}
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
                                        <h1 className="text-lg font-semibold">{serviceQuery.data?.title}</h1>
                                        <div className="">{parser(serviceQuery.data?.description || "")}</div>
                                        <div className="w-full flex">
                                            <div className="flex-1">
                                                <p className="capitalize font-medium">category</p>
                                                <Chip text={serviceQuery.data?.category} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="capitalize font-medium">tags</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {serviceQuery.data?.tags?.map((tag) => (
                                                        <Chip text={tag} key={tag} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="capitalize font-medium">images</p>
                                        <Space direction="horizontal">
                                            {serviceQuery.data?.images?.map((image) => (
                                                <Image
                                                    fallback={IMAGE_FALLBACK}
                                                    loading="lazy"
                                                    className="rounded-md bg-gray-200 object-cover "
                                                    src={image || undefined}
                                                    width={150}
                                                    height={150}
                                                />
                                            ))}
                                        </Space>
                                        {serviceQuery.data?.pdfs && <p className="capitalize font-medium mt-4 mb-2">documents</p>}
                                        <Space direction="vertical">
                                            {serviceQuery.data?.pdfs?.map((pdf, i) => (
                                                <ButtonFileDownload name={`document-${i + 1}.pdf`} url={pdf} key={pdf} />
                                            ))}
                                        </Space>
                                    </div>
                                </State.Data>
                                <State.Loading state={state}>
                                    <Skeleton paragraph={{ rows: 5 }} active />
                                    <Skeleton.Image active />
                                </State.Loading>
                                <State.Error state={state}>
                                    <Alert message={(serviceQuery.error as any)?.message || serviceQuery.error} />
                                </State.Error>
                            </>
                        )}
                    </State>
                </Card>
                <Card className="flex-1 h-fit">
                    <State data={serviceQuery.data} isLoading={serviceQuery.isLoading} isError={serviceQuery.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    <div className="w-full flex flex-col items-end h-fit">
                                        <p className="text-2xl font-semibold text-center w-full">
                                            {parseInt(serviceQuery.data?.price as string, 10)?.ToIndCurrency("Rp")}
                                        </p>
                                        {serviceQuery.data?.uid === user?.uid ? (
                                            <Button onClick={onClickDetailHandler} type="text">
                                                To Detail
                                            </Button>
                                        ) : (
                                            <Space size={20}>
                                                <WarningModal onOk={onAcceptWarningHandler}>
                                                    {(data) => (
                                                        <Button
                                                            loading={orderServiceMutation.isLoading}
                                                            onClick={data.showModal}
                                                            disabled={serviceQuery.data?.status === "draft" || orderServiceMutation.isLoading}
                                                            type="primary"
                                                            size="large"
                                                        >
                                                            Order
                                                        </Button>
                                                    )}
                                                </WarningModal>
                                                <ButtonChat chatInfo={chatInfo} disabled={serviceQuery.isLoading || userQuery.isLoading} />
                                            </Space>
                                        )}
                                    </div>
                                </State.Data>
                                <State.Loading state={state}>
                                    <Skeleton paragraph={{ rows: 3 }} active />
                                </State.Loading>
                                <State.Error state={state}>
                                    <Alert message={(serviceQuery.error as any)?.message || serviceQuery.error} />
                                </State.Error>
                            </>
                        )}
                    </State>
                </Card>
            </div>
        </Layout>
    );
}

export default DetailServiceOwner;
