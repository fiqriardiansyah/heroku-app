import { Alert, Skeleton } from "antd";
import State from "components/common/state";
import React from "react";
import { useQuery } from "react-query";
import authService from "services/auth";
import heroService from "services/hero";
import { MyJobData } from "./Models";
import MyJobCard from "./MyJobCard";

function MyJobList({ jobs, fetcher, onFinishStep }: { jobs: MyJobData[]; fetcher: any; onFinishStep: any }) {
    const user = authService.CurrentUser();

    const myBidQuery = useQuery(["my-bid"], async () => {
        const bids = heroService.GetAllMyBid({ uid: user?.uid as any });
        return bids;
    });

    return (
        <div className="flex flex-col gap-6">
            <State data={myBidQuery.data} isLoading={myBidQuery.isLoading} isError={myBidQuery.isError}>
                {(state) => (
                    <>
                        <State.Data state={state}>
                            {myBidQuery.data?.map((bid) => (
                                <MyJobCard bid={bid} />
                            ))}
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 4 }} avatar active />
                            <Skeleton paragraph={{ rows: 4 }} avatar active className="mt-4" />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(myBidQuery.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>
        </div>
    );
}

export default MyJobList;
