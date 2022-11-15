import Layout from "components/common/layout";
import React, { Children, useState } from "react";
import { Alert, Button, Card, Image, Skeleton, Space } from "antd";
import parser from "html-react-parser";
import { useParams } from "react-router-dom";
import { CHAT_PATH } from "utils/routes";
import { FaTelegramPlane } from "react-icons/fa";
import { useQuery } from "react-query";
import ownerService from "services/owner";
import State from "components/common/state";
import { IMAGE_FALLBACK } from "utils/constant";
import Chip from "components/common/chip";
import ButtonFileDownload from "components/button/file-download";
import CutTokenModal from "components/modal/cut-token-modal";

function DetailServiceOwner() {
    const { uid, id } = useParams();

    const serviceQuery = useQuery(
        ["service", uid, id],
        async () => {
            const serviceDetail = await ownerService.GetDetailService({ sid: id as any, hid: uid as any });
            return serviceDetail;
        },
        {
            enabled: !!uid && !!id,
        }
    );

    return (
        <Layout>
            <br />
            <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-2">
                    <State data={serviceQuery.data} isLoading={serviceQuery.isLoading} isError={serviceQuery.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    <div className="w-full">
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
                                        <Space size={20}>
                                            <CutTokenModal leftToken={12} total={parseInt(serviceQuery.data?.price as string, 10)}>
                                                {(data) => (
                                                    <Button
                                                        onClick={data.showModal}
                                                        disabled={serviceQuery.data?.status === "draft"}
                                                        type="primary"
                                                        size="large"
                                                    >
                                                        Order
                                                    </Button>
                                                )}
                                            </CutTokenModal>
                                            <button
                                                className="cursor-pointer rounded-full w-10 h-10 bg-white border-solid border border-primary flex items-center justify-center"
                                                type="button"
                                            >
                                                <FaTelegramPlane className="text-primary text-2xl" />
                                            </button>
                                        </Space>
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
