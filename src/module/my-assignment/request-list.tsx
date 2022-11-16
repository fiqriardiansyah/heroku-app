import { ServiceOwnerOrder, ServiceOwnerRequest } from "models";
import React from "react";
import RequestCard from "./request-list/request-card";

type Props = {
    data: ServiceOwnerRequest[];
};

function RequestList({ data }: Props) {
    if (data.length === 0) {
        return (
            <div className="w-full">
                <p className="text-center text-gray-400">No Request</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {data?.map((request) => (
                <RequestCard data={request} key={request.id} />
            ))}
        </div>
    );
}

export default RequestList;
