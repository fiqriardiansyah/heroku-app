/* eslint-disable no-prototype-builtins */
import { AutoComplete, Button, Card, Table, Tabs } from "antd";
import Layout from "components/common/layout";
import { UserContext } from "context/user";
import React, { useContext, useState } from "react";
import Swal from "sweetalert2";

interface ServiceActiveDataSource {
    key: any;
    no: number;
    title: string;
    finish: string;
    order: any;
    request: any;
    view: number;
}

interface ServiceDraftDataSource {
    key: any;
    no: number;
    created: string;
    title: string;
}

interface ServiceListProps {
    activeData: ServiceActiveDataSource[];
    draftData: ServiceDraftDataSource[];
    tab: "active" | "draft";
}

const mockVal = (data: string[], query: string) => {
    const filteredTitle = data.filter((val) => val.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    const result = filteredTitle.map((value) => ({ value }));
    return result;
};

function ServicesList({ activeData = [], draftData = [], tab }: ServiceListProps) {
    let columns;
    if (tab === "active") {
        columns = [
            {
                title: "No",
                dataIndex: "no",
                key: "no",
            },
            {
                title: "Service",
                dataIndex: "title",
                key: "title",
            },
            {
                title: "Finish",
                dataIndex: "finish",
                key: "finish",
            },
            {
                title: "Order",
                dataIndex: "order",
                key: "order",
            },
            {
                title: "View",
                dataIndex: "view",
                key: "view",
            },
            {
                title: "Request",
                dataIndex: "request",
                key: "request",
            },
        ];

        return (
            <Card>
                <Table dataSource={activeData} pagination={{ position: [] }} columns={columns} />
            </Card>
        );
    }

    columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
        },
        {
            title: "Service",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Created",
            dataIndex: "created",
            key: "created",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
        },
    ];

    return (
        <Card>
            <Table dataSource={draftData} pagination={{ position: [] }} columns={columns} />
        </Card>
    );
}

function MyService() {
    const [value, setValue] = useState("");
    const [tab, setTab] = useState<"active" | "draft">("active");
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const inActiveButtonStyle = { border: "none", backgroundColor: "inherit" };

    const onSelect = (data: string) => {
        console.log("onSelect", data);
    };

    const onChange = (data: string) => {
        setValue(data);
    };

    const myServicesOnClick = () => {
        Swal.fire("Apa itu My Services?", "That thing is still around?", "question");
    };

    const onDraftBtnClick = () => {
        setTab("draft");
    };

    const onActiveBtnClick = () => {
        setTab("active");
    };

    const activeDataSource: ServiceActiveDataSource[] = [
        {
            key: "1",
            no: 1,
            title: "Saya bisa membuat animasi 3d menggunakan blender, adobe family dan lainnya",
            finish: "1",
            order: 1,
            request: 1,
            view: 1,
        },
        {
            key: "2",
            no: 2,
            title: "Saya bisa mengedit fotomu disamping pohon",
            finish: "2",
            order: 2,
            request: 2,
            view: 2,
        },
    ];

    const draftDataSource: ServiceDraftDataSource[] = [
        {
            created: "12 February 2022",
            key: "1",
            no: 1,
            title: "Saya menggambar",
        },
    ];

    const onSearch = (searchText: string) => {
        if (!searchText) {
            setOptions([]);
            return;
        }

        setOptions(
            tab === "active"
                ? mockVal(
                      activeDataSource.map((data) => data.title),
                      searchText
                  )
                : mockVal(
                      draftDataSource.map((data) => data.title),
                      searchText
                  )
        );
    };

    return (
        <Layout>
            <br />
            <div className="flex flex-row space-x-2">
                <div className="flex flex-0 flex-row md:flex-1">
                    <h3 style={{ fontFamily: "Montserrat, sans-serif" }} className="text-xl font-">
                        My Services{" "}
                    </h3>
                    <div>
                        <button type="button" className="rounded-full bg-gray border-0" onClick={myServicesOnClick}>
                            ?
                        </button>
                    </div>
                </div>
                <div className="flex flex-1 flex-row gap-1">
                    <AutoComplete
                        options={options}
                        onSearch={onSearch}
                        style={{ width: "95%" }}
                        onChange={onChange}
                        onSelect={onSelect}
                        placeholder="Search Service"
                    />
                    <br />
                    <button type="button" className="bg-primary border-0 text-white md:w-1/3 w-fit" onClick={myServicesOnClick}>
                        Create New Service
                    </button>
                </div>
            </div>
            <br />
            <div className="flex gap-2 mb-3">
                {tab === "active" ? (
                    <Button type="primary">Active</Button>
                ) : (
                    <Button onClick={onActiveBtnClick} style={inActiveButtonStyle}>
                        Active
                    </Button>
                )}
                {tab === "draft" ? (
                    <Button type="primary">Draft</Button>
                ) : (
                    <Button onClick={onDraftBtnClick} style={inActiveButtonStyle}>
                        Draft
                    </Button>
                )}
            </div>

            <ServicesList tab={tab} draftData={draftDataSource} activeData={activeDataSource} />
        </Layout>
    );
}

export default MyService;
