import { Table } from "antd";
import React from "react";

const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    { title: "Task", dataIndex: "task", key: "task" },
    { title: "Bid", dataIndex: "bid", key: "bid" },
    { title: "Post Date", dataIndex: "postdate", key: "postdate" },
    { title: "Status", dataIndex: "status", key: "status" },
];

const i = 1;

const data = [
    {
        key: "1",
        no: `${i}`,
        task: `Ini adalah task ke-${i}`,
        bid: 32,
        postdate: `${i} Nov 2022`,
        status: `close`,
    },
    {
        key: "2",
        no: `${i}`,
        task: `Ini adalah task ke-${i}`,
        bid: 32,
        postdate: `${i} Nov 2022`,
        status: `close`,
    },
    {
        key: "3",
        no: `${i}`,
        task: `Ini adalah task ke-${i}`,
        bid: 32,
        postdate: `${i} Nov 2022`,
        status: `close`,
    },
];

function TableApp() {
    return <Table columns={columns} dataSource={data} scroll={{ x: "100%" }} />;
}

export default TableApp;
