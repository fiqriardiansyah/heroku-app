import { Button, Input } from "antd";
import Layout from "components/common/layout";
import WarningModal from "components/modal/warning-modal";
import MyContractList from "module/my-job/ContractList";
import { MyJobData } from "module/my-job/Models";
import MyJobList from "module/my-job/MyJobList";
import React, { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function MyJob() {
    const myjobs: MyJobData[] = [
        {
            title: "Convert Excel/PDF layout to HTML",
            owner: "Lucinta luna",
            description: `Hi Lucinta Luna,
            My name is Fiqri ardiansyah, I have 3 year experience of react development. I have read your requirement and I think I suitable for your need because I have work with many similar project like this before.
            I hope we can talk in the future`,
            id: "1",
            type_of_job: "task",
            status: "inbid",
            date: "12 Oct 2022",
            price: "290.000",
        },
        {
            title: "Convert Excel/PDF layout to HTML",
            owner: "Halim perdana kusuma",
            id: "2",
            type_of_job: "task",
            status: "ongoing",
            current: 5,
            date: "12 Oct 2022",
            price: "280.000",
        },
        {
            title: "Rip some code from a website html/css",
            owner: "Joni Iskandar",
            id: "3",
            type_of_job: "task",
            status: "ongoing",
            current: 1,
            date: "12 Oct 2022",
            price: "290.000",
        },
        {
            title: "ReactJs Senior Develover",
            company: "PT. Presentologics Indonesia",
            owner: "Joni Iskandar",
            id: "4",
            type_of_job: "hiring",
            status: "finish",
            date: "12 Oct 2022",
            price: "290.000",
        },
    ];

    const [jobs, setJobs] = useState<MyJobData[]>(myjobs.filter((job) => job.type_of_job === "task"));
    const [tab, setTab] = useState<"bidding" | "contracts">("bidding");

    const jobsQuery = () => {};

    const onFinishStep = (id: any, prevCurrent: number = 0) => {
        if (prevCurrent >= 5) return;
        const newJobs = jobs.map((job) => (job.id !== id ? job : { ...job, current: prevCurrent + 1 }));
        setJobs(newJobs);
    };

    const onContractsBtnClick = () => {
        setJobs(myjobs.filter((job) => job.type_of_job === "hiring"));
        setTab("contracts");
    };

    const onBiddingBtnClick = () => {
        setJobs(myjobs.filter((job) => job.type_of_job === "task"));
        setTab("bidding");
    };

    const myJobsQuestionOnClick = () => {
        Swal.fire("Apa itu My Services?", "That thing is still around?", "question");
    };

    const inactiveButtonStyle = { border: "none", backgroundColor: "inherit" };

    const clickWarningHandler = () => {};

    return (
        <Layout>
            <br />
            <div className="flex flex-row space-x-2 justify-between">
                <div className="flex items-center">
                    <p className="m-0 mr-2 font-semibold text-xl capitalize">My Job</p>
                    <AiFillQuestionCircle className="text-gray-400 text-xl cursor-pointer" onClick={myJobsQuestionOnClick} />
                </div>
                <WarningModal onOk={clickWarningHandler}>
                    {(dt) => <RiErrorWarningFill className="text-gray-400 text-xl cursor-pointer" onClick={dt.showModal} />}
                </WarningModal>
            </div>
            <br />
            <div className="flex gap-2 mb-3">
                {tab === "bidding" ? (
                    <Button type="primary">Bidding</Button>
                ) : (
                    <Button onClick={onBiddingBtnClick} style={inactiveButtonStyle}>
                        Bidding
                    </Button>
                )}
                {tab === "contracts" ? (
                    <Button type="primary">Contracts</Button>
                ) : (
                    <Button onClick={onContractsBtnClick} style={inactiveButtonStyle}>
                        Contracts
                    </Button>
                )}
            </div>

            {tab === "bidding" ? (
                <MyJobList onFinishStep={onFinishStep} fetcher={jobsQuery} jobs={jobs} />
            ) : (
                <MyContractList fetcher={jobsQuery} jobs={jobs} />
            )}
        </Layout>
    );
}

export default MyJob;
