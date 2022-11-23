import { Button, Input } from "antd";
import Layout from "components/common/layout";
import WarningModal from "components/modal/warning-modal";
import MyContractList from "module/my-job/ContractList";
import MyJobList from "module/my-job/MyJobList";
import React, { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function MyJob() {
    const [tab, setTab] = useState<"bidding" | "contracts">("bidding");

    const onContractsBtnClick = () => {
        setTab("contracts");
    };

    const onBiddingBtnClick = () => {
        setTab("bidding");
    };

    const myJobsQuestionOnClick = () => {
        Swal.fire("What is My Job", "It is a page that contains the job that you have taken. While bid is a task and contract is a job");
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

            {tab === "bidding" ? <MyJobList /> : <MyContractList />}
        </Layout>
    );
}

export default MyJob;
