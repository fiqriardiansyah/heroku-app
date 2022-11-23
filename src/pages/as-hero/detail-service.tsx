import { Alert, Button, Card, Image, message, Modal, Skeleton, Space, Spin, Tabs } from "antd";
import Layout from "components/common/layout";
import State from "components/common/state";
import { ServiceDetail, ServiceFinish, ServiceOrder, ServiceRequest } from "models";
import RequestCard from "module/detail-service-as-hero/request-list/request-card";
import RequestList from "module/detail-service-as-hero/request-list";
import React, { useMemo, useState } from "react";
import { IoMdWarning } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import authService from "services/auth";
import heroService from "services/hero";
import Utils from "utils";
import { IMAGE_FALLBACK } from "utils/constant";
import { CREATE_SERVICE_PATH, MY_SERVICE_PATH } from "utils/routes";
import OrderList from "module/detail-service-as-hero/order-list";
import FinishList from "module/detail-service-as-hero/finish-list";
import { AiFillQuestionCircle } from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";
import WarningModal from "components/modal/warning-modal";

const tabs = [
    {
        label: `Orders`,
        key: "1",
    },
    {
        label: `Finish`,
        key: "2",
    },
    {
        label: `Request`,
        key: "3",
    },
];

function DetailServiceHero() {
    const { id: sid } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("1");

    const serviceQuery = useQuery(
        [`detail-service${sid}`],
        async () => {
            const service = await heroService.GetDetailService({ sid: sid as any });
            return service;
        },
        {
            enabled: !!sid,
        }
    );

    const deleteMutation = useMutation(
        async ({ id, callback }: { id: string; callback: () => void }) => {
            await heroService.DeleteMyService(id);
            callback();
        },
        {
            onSuccess: () => {
                message.success("Service deleted!");
                navigate(MY_SERVICE_PATH);
            },
        }
    );

    const onClickDelete = (data: ServiceDetail | undefined) => {
        if (!data) return;
        if (data.orders && data.orders?.length !== 0) {
            message.warning("You can not delete this service, you have some order to finish");
            return;
        }
        if (data.request && data.request?.length !== 0) {
            message.warning("You can not delete this service, you have some request");
            return;
        }

        Modal.confirm({
            title: "Delete",
            icon: <IoMdWarning className="text-red-400" />,
            content: `Hapus service '${data?.title}' ?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    deleteMutation.mutate({
                        id: data.id as any,
                        callback: () => {
                            resolve(true);
                        },
                    });
                });
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

    const onClickEdit = (data: ServiceDetail | undefined) => {
        if (!data) return;
        if (data.orders && data.orders?.length !== 0) {
            message.warning("You can not edit this service, you have some order to finish");
            return;
        }
        if (data.request && data.request?.length !== 0) {
            message.warning("You can not edit this service, you have some request");
            return;
        }

        navigate(`${CREATE_SERVICE_PATH}?edit=${data.id}`);
    };

    const onChangeTab = (key: string) => {
        setActiveTab(key);
    };

    const request = Utils.parseTreeObjectToArray<ServiceRequest>(serviceQuery.data?.request || {});
    const orders = Utils.parseTreeObjectToArray<ServiceOrder>(serviceQuery.data?.orders || {});
    const finish = Utils.parseTreeObjectToArray<ServiceFinish>(serviceQuery.data?.finish || {});

    const refetchService = () => {
        serviceQuery.refetch();
    };

    const clickWarningHandler = () => {};

    return (
        <Layout>
            <div className="flex w-full mt-5 gap-4 flex-wrap items-center">
                <State data={serviceQuery.data} isLoading={serviceQuery.isLoading} isError={serviceQuery.isError}>
                    {(state) => (
                        <>
                            <State.Data state={state}>
                                <Card className="flex-2 h-fit">
                                    <div className="w-full flex items-center justify-between">
                                        <p className="capitalize text-gray-400 font-semibold">all your work for this service is here</p>
                                        <WarningModal onOk={clickWarningHandler}>
                                            {(dt) => <RiErrorWarningFill className="text-gray-400 text-xl cursor-pointer" onClick={dt.showModal} />}
                                        </WarningModal>
                                    </div>
                                    <Tabs activeKey={activeTab} items={tabs} onChange={onChangeTab} />
                                    {activeTab === "1" && (
                                        <OrderList service={serviceQuery.data} refetchService={refetchService} sid={sid as any} data={orders} />
                                    )}
                                    {activeTab === "2" && <FinishList service={serviceQuery.data} sid={sid as any} data={finish} />}
                                    {activeTab === "3" && (
                                        <RequestList service={serviceQuery.data} refetchService={refetchService} sid={sid as any} data={request} />
                                    )}
                                </Card>
                                <Card className="flex-1 h-fit !w-[300px]">
                                    <Image
                                        preview={false}
                                        referrerPolicy="no-referrer"
                                        fallback={IMAGE_FALLBACK}
                                        src={serviceQuery.data?.poster_image || undefined}
                                        height={200}
                                        width="100%"
                                        placeholder={
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Spin />
                                            </div>
                                        }
                                        className="bg-gray-300 rounded-md object-cover !w-full"
                                    />
                                    <p className="font-semibold capitalize m-0 my-2 break-words">{serviceQuery.data?.title}</p>
                                    <p className="text-gray-400 text-sm font-light break-words">
                                        {Utils.stripHtml(serviceQuery.data?.description || "").CutText(200)}
                                    </p>
                                    <div className="w-full flex items-center justify-end">
                                        <Space>
                                            <Button onClick={() => onClickDelete(serviceQuery.data)} type="text">
                                                Delete service
                                            </Button>
                                            <Button onClick={() => onClickEdit(serviceQuery.data)} type="primary">
                                                Edit Service
                                            </Button>
                                        </Space>
                                    </div>
                                </Card>
                            </State.Data>
                            <State.Loading state={state}>
                                <Skeleton paragraph={{ rows: 5 }} />
                            </State.Loading>
                            <State.Error state={state}>
                                <Alert message={(serviceQuery.error as any)?.message} type="error" />
                            </State.Error>
                        </>
                    )}
                </State>
            </div>
        </Layout>
    );
}

export default DetailServiceHero;
