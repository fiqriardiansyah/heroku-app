import { IDs, ServiceDetail, ServiceOrder, ServiceRequest } from "models";
import React from "react";
import Order from "./order-card";

type Props = Pick<IDs, "sid"> & {
    data: ServiceOrder[];
    service: ServiceDetail | undefined;
    refetchService: () => void;
};

function OrderList({ data, sid, refetchService, service }: Props) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[100px]">
                <p className="capitalize text-gray-400">No order</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col">
            {data?.map((order) => (
                <Order service={service} refetchService={refetchService} sid={sid} data={order} key={order.id} />
            ))}
        </div>
    );
}

export default OrderList;
