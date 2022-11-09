import Layout from "components/common/layout";
import { AutoComplete, Card, Tabs } from "antd";
import React, { useState } from "react";
import TableApp from "components/common/table";

const Swal = require("sweetalert2");

const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
});

const items = [
    { label: "Task", key: "task-tabs", children: <TableApp /> }, // remember to pass the key prop
    { label: "Hiring", key: "hiring-tabs", children: <TableApp /> },
];

function MyPost() {
    const [value, setValue] = useState("");
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const onSearch = (searchText: string) => {
        setOptions(
            !searchText
                ? []
                : [
                      mockVal(searchText),
                      mockVal(searchText, 2),
                      mockVal(searchText, 3),
                  ]
        );
    };

    const onSelect = (data: string) => {
        console.log("onSelect", data);
    };

    const onChange = (data: string) => {
        setValue(data);
    };

    const myPostOnClick = () => {
        Swal.fire(
            "Apa itu My Post?",
            "That thing is still around?",
            "question"
        );
    };

    return (
        <Layout>
            <br />
            <div className="flex flex-row space-x-2">
                <div className="flex flex-0 flex-row md:flex-1">
                    <h3>My Post </h3>
                    <div>
                        <button
                            type="button"
                            className="rounded-full bg-gray border-0"
                            onClick={myPostOnClick}
                        >
                            ?
                        </button>
                    </div>
                </div>
                <div className="flex flex-1 flex-row">
                    <AutoComplete
                        options={options}
                        style={{ width: "100%" }}
                        onSelect={onSelect}
                        onSearch={onSearch}
                        placeholder="Search Service"
                    />
                    <br />
                    <button
                        type="button"
                        className="bg-primary border-0 text-white w-full md:w-1/3"
                        onClick={myPostOnClick}
                    >
                        Create new post
                    </button>
                </div>
            </div>
            <br />
            <Card>
                <Tabs items={items} />
                {/* <Tabs defaultActiveKey="1">
                    <Panes tab="Task" key="task-tabs">
                        <TableApp />
                    </Panes>
                    <Panes tab="Hiring" key="hiring-tabs">
                        <TableApp />
                    </Panes>
                </Tabs> */}
                {/* <Tabs items={items}> */}
                {/* <Tabs.TabPane tab="Task" key="task-tabs">
                    <TableApp />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Hiring" key="hiring-tabs">
                    Conten
                </Tabs.TabPane> */}
                {/* </Tabs> */}
            </Card>
        </Layout>
    );
}

export default MyPost;
