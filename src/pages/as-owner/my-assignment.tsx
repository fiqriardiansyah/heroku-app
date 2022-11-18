import Layout from "components/common/layout";
import { Alert, Card, Skeleton, Tabs } from "antd";
import React, { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import OrderList from "module/my-assignment/order-list";
import FinishList from "module/my-assignment/finish-list";
import RequestList from "module/my-assignment/request-list";
import { useQuery } from "react-query";
import authService from "services/auth";
import ownerService from "services/owner";
import State from "components/common/state";

const Swal = require("sweetalert2");

function MyAssignment() {
    const user = authService.CurrentUser();

    const assignmentQuery = useQuery(["assignment"], async () => {
        const assigments = await ownerService.GetMyAssigments({ uid: user?.uid as any });
        return assigments;
    });

    const myServicesOnClick = () => {
        Swal.fire(
            "What is My Assignment?",
            "My Assignment is a page that tracks the process of determining how much work the Hero has accomplished.",
            "question"
        );
    };

    const refetchFetcher = () => {
        assignmentQuery.refetch();
    };

    const itemsTabs = [
        { label: "Order", key: "order-tabs", children: <OrderList refetchFetcher={refetchFetcher} data={assignmentQuery.data?.orders || []} /> }, // remember to pass the key prop
        { label: "Finish", key: "finish-tabs", children: <FinishList data={assignmentQuery.data?.finish || []} /> },
        { label: "Request", key: "request-tabs", children: <RequestList data={assignmentQuery.data?.request || []} /> },
    ];

    return (
        <Layout>
            <br />
            <div className="flex flex-row space-x-2 justify-between">
                <div className="flex items-center">
                    <p className="m-0 mr-2 font-semibold text-xl capitalize">My Assigment</p>
                    <AiFillQuestionCircle className="text-gray-400 text-xl cursor-pointer" onClick={myServicesOnClick} />
                </div>
            </div>
            <br />
            <Card>
                <State data={assignmentQuery.data} isLoading={assignmentQuery.isLoading} isError={assignmentQuery.isError}>
                    {(state) => (
                        <>
                            <State.Data state={state}>
                                <Tabs items={itemsTabs} />
                            </State.Data>
                            <State.Loading state={state}>
                                <Skeleton paragraph={{ rows: 4 }} avatar active />
                                <Skeleton paragraph={{ rows: 4 }} avatar active className="mt-4" />
                            </State.Loading>
                            <State.Error state={state}>
                                <Alert message={(assignmentQuery.error as any)?.message} type="error" />
                            </State.Error>
                        </>
                    )}
                </State>
            </Card>
        </Layout>
    );
}

export default MyAssignment;
