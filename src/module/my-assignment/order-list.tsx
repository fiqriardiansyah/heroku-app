import { ServiceOwnerOrder } from "models";
import React from "react";
import OrderCard from "./order-list/order-card";

type Props = {
    data: ServiceOwnerOrder[];
    refetchFetcher: () => void;
};

function OrderList({ data, refetchFetcher }: Props) {
    if (data.length === 0) {
        return (
            <div className="w-full">
                <p className="text-center text-gray-400">No Order</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {data?.map((request) => (
                <OrderCard refetchFetcher={refetchFetcher} data={request} key={request.id} />
            ))}
        </div>
    );
}

export default OrderList;
