import { Alert, Card, Skeleton } from "antd";
import State from "components/common/state";
import React from "react";
import { useQuery } from "react-query";
import authService from "services/auth";
import NoJobs from "assets/svgs/no-jobs.svg";
import heroService from "services/hero";
import MyJobCard from "./MyJobCard";

function MyJobList() {
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
                            {myBidQuery.data?.length === 0 ? (
                                <Card className="w-full py-3 px-5 bg-white rounded-xl h-80vh flex justify-center align-middle">
                                    <img src={NoJobs} alt="No Jobs" className="w-11/12 h-full sm:w-96" />
                                </Card>
                            ) : (
                                myBidQuery.data?.map((bid) => <MyJobCard key={bid.id} bid={bid} />)
                            )}
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
