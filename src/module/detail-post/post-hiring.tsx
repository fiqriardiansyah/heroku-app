import React from "react";

/* eslint-disable no-shadow */
import { Alert, Card, Image, Skeleton, Space } from "antd";
import State from "components/common/state";

import { useMutation, useQuery, UseQueryResult } from "react-query";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import parser from "html-react-parser";
import Chip from "components/common/chip";
import moment from "moment";
import { Poster } from "models";
import Utils from "utils";

type Props<T> = {
    fetcher: UseQueryResult<T, unknown>;
};

function PostHiring<T extends Poster>({ fetcher }: Props<T>) {
    const userQuery = useQuery(
        ["user", fetcher.data?.uid],
        async () => {
            const usr = await userService.GetUser(fetcher.data?.uid as any);
            return usr;
        },
        {
            enabled: !!fetcher.data?.uid,
        }
    );

    const totalApplicants = fetcher.data?.applications ? Utils.parseTreeObjectToArray(fetcher.data.applications || {})?.length : 0;

    return (
        <Card>
            <p className="m-0 capitalize font-semibold text-lg">{fetcher.data?.title}</p>
            <p className="capitalize text-sm font-medium m-0">{fetcher.data?.company}</p>
            <p className="font-medium m-0 mt-4">Owner: {userQuery.data?.name || ""}</p>
            <span className="text-gray-400 text-xs">Post {moment(fetcher.data?.date).format("DD MMM yyyy")}</span>
            <div className="my-4">{parser(fetcher.data?.description || "")}</div>
            <div className="mb-4">
                <p className="capitalize font-medium m-0">type of job</p>
                <p className="capitalize text-gray-400 text-sm m-0">{fetcher.data?.type_of_job}</p>
            </div>
            <div className="w-full flex">
                <div className="flex-1">
                    <p className="capitalize font-medium">category</p>
                    <Chip text={fetcher.data?.category} />
                </div>
                <div className="flex-1">
                    <p className="capitalize font-medium">skills</p>
                    <div className="flex flex-wrap gap-2">
                        {fetcher.data?.skills?.map((skill) => (
                            <Chip text={skill} key={skill} />
                        ))}
                    </div>
                </div>
            </div>
            <p className="m-0 mt-4">{totalApplicants} Applicants</p>
        </Card>
    );
}

export default PostHiring;
