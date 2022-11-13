import Layout from "components/common/layout";
import { Card, AutoComplete, Steps, Tabs } from "antd";
import React, { useState } from "react";
import WaitingResponseImage from "assets/svgs/waiting-response.svg";
import { FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CHAT_PATH } from "utils/routes";

const Swal = require("sweetalert2");

const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
});

const { Step } = Steps;

function MyAssignmentHero() {
    return (
        <div className="p-2 flex flex-col justify-center pb-10 bg-white rounded-lg border border-gray-300">
            <div className="flex flex-row">
                <img className="w-12 h-12 rounded-full shadow-lg" src="user?.photoURL" alt="" />
                <div className="ml-3">
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">user?.displayName</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {/* {user?.workField}  */}
                        Saya bisa membuat animasi 3D menggunakan blender, adobe family dan lainnya
                    </span>
                </div>
            </div>
        </div>
    );
}

function MyAssignmentProcess() {
    return (
        <Card>
            <MyAssignmentHero />
            <Steps>
                <Step title="Start" description="Starting on project at 10 Nov 2022" />
                <Step title="Process" description="Hero, process service" />
                <Step title="Deliver" description="Hero sends work" />
                <Step title="Checking" description="Owner checks the work" />
                <Step title="Finish" description="This work has been completed" />
            </Steps>
        </Card>
    );
}

function MyAssignmentRequest() {
    const confirmationRequestOnClick = () => {
        Swal.fire({
            title: "Do you want to accept the request?",
            showDenyButton: true,
            confirmButtonText: "Accept",
            denyButtonText: "Decline",
            customClass: {
                actions: "my-actions",
                confirmButton: "order-1",
                denyButton: "order-2",
            },
        }).then((result: any) => {
            if (result.isConfirmed) {
                Swal.fire("You accept this Hero to do your work!", "", "success");
            } else if (result.isDenied) {
                Swal.fire("You decline this Hero to do your work!", "", "error");
            }
        });
    };

    return (
        <Card className="flex flex-col">
            <MyAssignmentHero />
            <div className="flex flex-col justify-center items-center">
                <div>
                    <img src={WaitingResponseImage} alt="Waiting Response" className="w-36 h-36" />
                </div>
                <p>Waiting for Owner Confirmation...</p>
                <button type="button" className="rounded bg-primary text-base border-0 h-12" onClick={confirmationRequestOnClick}>
                    Confirmation
                </button>
            </div>
            <Link to={CHAT_PATH}>
                <div className="mt-4 flex place-items-end">
                    <button type="button" className=" px-2 h-12 rounded bg-primary text-base border-0">
                        <FaPaperPlane /> Chat?
                    </button>
                </div>
            </Link>
        </Card>
    );
}

const itemsTabs = [
    { label: "Order", key: "torder-tabs", children: <MyAssignmentProcess /> }, // remember to pass the key prop
    { label: "Finish", key: "finish-tabs", children: <MyAssignmentProcess /> },
    { label: "Request", key: "request-tabs", children: <MyAssignmentRequest /> },
];

function MyAssignment() {
    const [value, setValue] = useState("");
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const onSearch = (searchText: string) => {
        setOptions(!searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]);
    };

    const onSelect = (data: string) => {
        console.log("onSelect", data);
    };

    const onChange = (data: string) => {
        setValue(data);
    };

    const myPostOnClick = () => {
        Swal.fire(
            "What is My Assignment?",
            "My Assignment is a page that tracks the process of determining how much work the Hero has accomplished.",
            "question"
        );
    };

    return (
        <Layout>
            <br />
            <div className="flex flex-row space-x-2">
                <div className="flex flex-0 flex-row md:flex-1">
                    <h3>My Assignment </h3>
                    <div>
                        <button type="button" className="rounded-full bg-gray border-0" onClick={myPostOnClick}>
                            ?
                        </button>
                    </div>
                </div>
                <div className="flex flex-1 flex-row">
                    <AutoComplete options={options} style={{ width: "100%" }} onSelect={onSelect} onSearch={onSearch} placeholder="Search Service" />
                </div>
            </div>
            <br />
            <Card>
                <Tabs items={itemsTabs} />
            </Card>
        </Layout>
    );
}

export default MyAssignment;
