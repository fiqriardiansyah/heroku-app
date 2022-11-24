import React, { useMemo } from "react";
import { Image, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UseQueryResult } from "react-query";
import { Link } from "react-router-dom";
import { ServiceData, ServiceFinish, ServiceOrder, ServiceRequest } from "models";
import { IMAGE_FALLBACK } from "utils/constant";
import { SERVICE_HERO_PATH } from "utils/routes";
import Utils from "utils";

type Props<T> = {
    fetcher: UseQueryResult<T[], unknown>;
    services: ServiceData[];
};

function ActiveServiceTable<T extends ServiceData>({ services, fetcher }: Props<T>) {
    const parseServices = useMemo(() => {
        return services.map((service) => {
            return {
                ...service,
                request: Utils.parseTreeObjectToArray<ServiceRequest>(service.request),
                orders: Utils.parseTreeObjectToArray<ServiceOrder>(service.orders),
                finish: Utils.parseTreeObjectToArray<ServiceFinish>(service.finish),
            };
        });
    }, [services]);

    const columns: ColumnsType<T> = [
        {
            title: "No",
            dataIndex: "-",
            render: (text, record, i) => <p className="capitalize m-0">{i + 1}</p>,
        },
        {
            title: "Service",
            render: (text, record) => {
                return (
                    <Link to={`${SERVICE_HERO_PATH}/${record.id}`}>
                        <div className="flex items-start text-gray-600">
                            <Image
                                preview={false}
                                fallback={IMAGE_FALLBACK}
                                loading="lazy"
                                className="rounded-md bg-gray-200 object-cover "
                                src={record?.poster_image || undefined}
                                width={100}
                                height={60}
                            />
                            <p className="m-0 ml-2 capitalize">{record?.title}</p>
                        </div>
                    </Link>
                );
            },
        },
        {
            title: "Finish",
            dataIndex: "finish",
            render: (text, record) => <p className="capitalize m-0">{record?.finish?.length || 0}</p>,
        },
        {
            title: "Orders",
            dataIndex: "orders",
            render: (text, record) => <p className="capitalize m-0">{record?.orders?.length || 0}</p>,
        },
        {
            title: "Viewed",
            dataIndex: "viewed",
            render: (text) => <p className="capitalize m-0">{text || 0}</p>,
        },
        {
            title: "Request",
            dataIndex: "request",
            render: (text, record) => <p className="capitalize m-0">{record?.request?.length || 0}</p>,
        },
    ];

    return (
        <Table
            loading={fetcher.isLoading}
            columns={columns}
            dataSource={parseServices as any}
            className="w-full overflow-x-scroll sm:overflow-auto"
            pagination={false}
        />
    );
}

export default ActiveServiceTable;
