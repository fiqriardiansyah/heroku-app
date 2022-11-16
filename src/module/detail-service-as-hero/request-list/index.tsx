import { IDs, ServiceRequest } from "models";
import React from "react";
import RequestCard from "./request-card";

type Props = Pick<IDs, "sid"> & {
    data: ServiceRequest[];
    refetchService: () => void;
};

function RequestList({ data, sid, refetchService }: Props) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[100px]">
                <p className="capitalize text-gray-400">No request</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col">
            {data?.map((rqst) => (
                <RequestCard refetchService={refetchService} sid={sid} data={rqst} key={rqst.id} />
            ))}
        </div>
    );
}

export default RequestList;
