import React from "react";
import { Button, Image, Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UseQueryResult } from "react-query";
import { Link } from "react-router-dom";
import { ServiceData } from "models";
import { IMAGE_FALLBACK } from "utils/constant";
import { CREATE_SERVICE_PATH, SERVICE_HERO_PATH } from "utils/routes";
import { IoMdWarning } from "react-icons/io";
import moment from "moment";

type Props<T> = {
    fetcher: UseQueryResult<T[], unknown>;
    services: ServiceData[];
    onClickDelete: (data: T, callback: () => void) => void;
};

function DraftServiceTable<T extends ServiceData>({ services, fetcher, onClickDelete }: Props<T>) {
    const onClickDlt = (data: T) => {
        Modal.confirm({
            title: "Delete",
            icon: <IoMdWarning className="text-red-400" />,
            content: `Hapus service '${data.title}' ?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickDelete(data, () => {
                        resolve(true);
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
                    <Link to={`${CREATE_SERVICE_PATH}?edit=${record.id}`}>
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
            title: "Created At",
            dataIndex: "date",
            render: (text, record) => <p className="capitalize m-0">{moment(record.post_date).format("DD MMM yyyy, LT")}</p>,
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <Button type="primary" danger onClick={() => onClickDlt(record)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <Table
            loading={fetcher.isLoading}
            columns={columns}
            dataSource={services as any}
            className="w-full overflow-x-scroll sm:overflow-auto"
            pagination={false}
        />
    );
}

export default DraftServiceTable;
