import { ServiceOwnerFinish } from "models";
import React from "react";
import FinishCard from "./finish-list/finish-card";

type Props = {
    data: ServiceOwnerFinish[];
};

function FinishList({ data }: Props) {
    if (data.length === 0) {
        return (
            <div className="w-full">
                <p className="text-center text-gray-400">No Service Finished</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {data?.map((request) => (
                <FinishCard data={request} key={request.id} />
            ))}
        </div>
    );
}

export default FinishList;
