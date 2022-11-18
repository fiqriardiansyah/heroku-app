import React from "react";

/* eslint-disable no-shadow */
import { Alert, Button, Card, Image, Skeleton, Space } from "antd";
import Layout from "components/common/layout";
import State from "components/common/state";

import { useMutation, useQuery, UseQueryResult } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import ownerService from "services/owner";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import parser from "html-react-parser";
import Chip from "components/common/chip";
import moment from "moment";
import { Poster } from "models";
import Utils from "utils";
import { DETAIL_POST_PATH } from "utils/routes";

type Props<T> = {
    fetcher: UseQueryResult<T, unknown>;
};

function PostTask<T extends Poster>({ fetcher }: Props<T>) {
    const location = useLocation();

    const userQuery = useMutation(async (uid: string) => {
        const usr = await userService.GetUser(uid);
        return usr;
    });

    const bids = Utils.parseTreeObjectToArray(fetcher.data?.bids || {});

    return (
        <Card className="">
            <State data={userQuery.data} isLoading={userQuery.isLoading} isError={userQuery.isError}>
                {(state) => (
                    <>
                        <State.Data state={state}>
                            <div className="w-full flex mb-5">
                                <Image
                                    preview={false}
                                    referrerPolicy="no-referrer"
                                    fallback={IMAGE_FALLBACK}
                                    src={userQuery.data?.profile}
                                    width={40}
                                    height={40}
                                    className="flex-1 bg-gray-300 rounded-full object-cover"
                                />
                                <div className="flex flex-col ml-3">
                                    <p className="m-0 font-semibold text-gray-500 capitalize">{userQuery.data?.name}</p>
                                    <p className="m-0 text-gray-400 text-xs capitalize">programmer</p>
                                    {/* [IMPORTANT] ubah pekerjaan user nanti */}
                                </div>
                            </div>
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 2 }} avatar />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(userQuery.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>
            <p className="m-0 capitalize font-semibold text-lg">{fetcher.data?.title}</p>
            <p className="font-medium m-0 mt-4">Owner: Fiqri ardiansyah</p>
            <span className="text-gray-400 text-xs">Post {moment(fetcher.data?.date).format("DD MMM yyyy")}</span>
            <p className="m-0">
                {fetcher.data?.is_fixed_price ? "Fixed" : "Bargain"} price - {parseInt(fetcher.data?.price as string, 10).ToIndCurrency("Rp")}
            </p>
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
            <div className="flex w-full items-center justify-between">
                <p className="m-0 capitalize text-gray-700">{bids?.length || 0} Bids</p>
                <Link to={`${location.pathname}/progress`}>
                    <Button type="link">See progress</Button>
                </Link>
            </div>
        </Card>
    );
}

export default PostTask;