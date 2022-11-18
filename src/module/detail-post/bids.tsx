import { Card } from "antd";
import { Bid, Poster } from "models";
import React from "react";
import { UseQueryResult } from "react-query";
import Utils from "utils";
import BidCard from "./bid-card";

type Props<T> = {
    fetcher: UseQueryResult<T, unknown>;
};

function Bids<T extends Poster>({ fetcher }: Props<T>) {
    const bids = fetcher.data?.bids ? Utils.parseTreeObjectToArray<{ biid: string; id: string }>(fetcher.data.bids) : [];
    return (
        <Card>
            <div className="flex w-full items-center justify-between mb-5">
                <p className="capitalize font-semibold m-0">Bids</p>
                <p className="m-0 capitalize text-gray-700">Accept: {`${fetcher.data?.accepted_hero || 0}/${fetcher.data?.number_of_hero}`}</p>
            </div>
            {bids?.map((bid) => (
                <BidCard fetcher={fetcher} key={bid.id} biid={bid.biid} />
            ))}
        </Card>
    );
}

export default Bids;
