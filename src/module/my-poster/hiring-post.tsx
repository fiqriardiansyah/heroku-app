import React, { useMemo } from "react";
import { Image, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UseQueryResult } from "react-query";
import { Link } from "react-router-dom";
import { Poster, ServiceFinish, ServiceOrder, ServiceRequest } from "models";
import { IMAGE_FALLBACK } from "utils/constant";
import { DETAIL_JOB_PATH, DETAIL_POST_PATH, SERVICE_HERO_PATH } from "utils/routes";
import Utils from "utils";
import moment from "moment";

type Props<T> = {
    fetcher: UseQueryResult<T[], unknown>;
    posters: Poster[];
};

const applicantTotal = (poster: Poster) => {
    if (!poster) return 0;
    if (!poster.applications) return 0;
    return Utils.parseTreeObjectToArray(poster.applications).length;
};

function HiringPost<T extends Poster>({ posters, fetcher }: Props<T>) {
    const columns: ColumnsType<T> = [
        {
            title: "No",
            dataIndex: "-",
            render: (text, record, i) => <p className="capitalize m-0">{i + 1}</p>,
        },
        {
            title: "Vacancy",
            render: (text, record) => {
                return (
                    <Link to={`${DETAIL_POST_PATH}/${record.id}`}>
                        <p className="capitalize m-0">{record.title}</p>
                    </Link>
                );
            },
        },
        {
            title: "Applicant",
            dataIndex: "applications",
            render: (text, record) => <p className="capitalize m-0">{applicantTotal(record)}</p>,
        },
        {
            title: "Accept",
            dataIndex: "-",
            render: (text, record) => <p className="capitalize m-0">{record?.accepted_hero || 0}</p>,
        },
        {
            title: "Post Date",
            dataIndex: "date",
            render: (text, record) => <p className="capitalize m-0">{moment(text).format("DD MMM yyyy, LT")}</p>,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
    ];

    return <Table loading={fetcher.isLoading} columns={columns} dataSource={posters as any} className="w-full" pagination={false} />;
}

export default HiringPost;
