import { IDs, ServiceDetail, ServiceFinish } from "models";
import React from "react";
import FinishCard from "./finish-card";

type Props = Pick<IDs, "sid"> & {
    service: ServiceDetail | undefined;
    data: ServiceFinish[];
};

function FinishList({ data, sid, service }: Props) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[100px]">
                <p className="capitalize text-gray-400">No Service Finished</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col">
            {data?.map((order) => (
                <FinishCard service={service} sid={sid} data={order} key={order.id} />
            ))}
        </div>
    );
}

export default FinishList;
