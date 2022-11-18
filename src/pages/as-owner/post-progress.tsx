import { Alert, Button, Skeleton } from "antd";
import Layout from "components/common/layout";
import State from "components/common/state";
import ProgressCard from "module/post-progress/progress-card";
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import heroService from "services/hero";

function PostProgress() {
    const { id } = useParams();

    const posterBidsQuery = useQuery(["bids", id], async () => {
        const bids = await heroService.GetPosterBid({ pid: id as any });
        if (!bids) return [];
        return bids.filter((bid) => bid.accept);
    });

    return (
        <Layout>
            <div className="mt-4">
                <State data={posterBidsQuery.data} isLoading={posterBidsQuery.isLoading} isError={posterBidsQuery.isError}>
                    {(state) => (
                        <>
                            <State.Data state={state}>
                                {posterBidsQuery.data?.map((bid) => (
                                    <ProgressCard biid={bid.id as any} />
                                ))}
                            </State.Data>
                            <State.Loading state={state}>
                                <Skeleton paragraph={{ rows: 1 }} avatar />
                            </State.Loading>
                            <State.Error state={state}>
                                <Alert message={(posterBidsQuery.error as any)?.message} type="error" />
                            </State.Error>
                        </>
                    )}
                </State>
            </div>
        </Layout>
    );
}

export default PostProgress;
