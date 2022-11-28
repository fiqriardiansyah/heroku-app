/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-redeclare */
import { Rate } from "antd";
import { Review } from "models";
import moment from "moment";
import React from "react";
import { UseQueryResult } from "react-query";

type Props1 = {
    reviews?: Review[] | any[];
};

function Reviews({ reviews = [] }: Props1): React.ReactElement;

function Reviews(param: any) {
    if (param?.reviews) {
        return (
            <div className="max-h-[500px] overflow-y-auto">
                <p className="capitalize font-semibold m-0 mb-3">reviews</p>
                {param.reviews?.length === 0 && <p className="text-gray-300 capitalize text-center mt-4">no review yet</p>}
                {(param.reviews as Review[])
                    ?.sort((a, b) => b.date - a.date)
                    ?.map((review) => (
                        <div className="w-full mb-5">
                            <div className="flex w-full items-start justify-between">
                                <div className="">
                                    <p className="m-0 text-gray-600 font-medium capitalize">{review.name?.CutText(20)}</p>
                                    <span className="text-xs text-gray-400 font-light m-0">{moment(review.date).format("DD MMM yyyy")}</span>{" "}
                                </div>
                                <Rate disabled defaultValue={review.rate} allowHalf />
                            </div>
                            <p className="text-gray-400 m-0 break-words">{review.review}</p>
                        </div>
                    ))}
            </div>
        );
    }

    return (
        <div className="max-h-[500px] overflow-y-auto">
            <p className="capitalize font-medium m-0 my-5">reviews</p>
            fetcher
        </div>
    );
}

export default Reviews;
