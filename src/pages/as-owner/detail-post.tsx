/* eslint-disable no-shadow */
import { Alert, Card, Image, Skeleton, Space } from "antd";
import Layout from "components/common/layout";
import State from "components/common/state";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ownerService from "services/owner";
import userService from "services/user";
import { IMAGE_FALLBACK } from "utils/constant";
import parser from "html-react-parser";
import Chip from "components/common/chip";
import moment from "moment";
import PostTask from "module/detail-post/post-task";
import PostHiring from "module/detail-post/post-hiring";
import Bids from "module/detail-post/bids";
import Applicants from "module/detail-post/applicants";

function DetailPost() {
    const { id } = useParams();

    const posterQuery = useQuery(
        ["poster", id],
        async () => {
            const poster = await ownerService.GetOnePoster({ pid: id as any });
            return poster;
        },
        {
            enabled: !!id,
        }
    );

    return (
        <Layout>
            <br />
            <State data={posterQuery.data} isLoading={posterQuery.isLoading} isError={posterQuery.isError}>
                {(state) => (
                    <>
                        <State.Data state={state}>
                            {posterQuery.data?.type_of_job === "task" && (
                                <>
                                    <PostTask fetcher={posterQuery} />
                                    <br />
                                    <Bids fetcher={posterQuery} />
                                </>
                            )}
                            {posterQuery.data?.type_of_job === "hiring" && (
                                <>
                                    <PostHiring fetcher={posterQuery} />
                                    <br />
                                    <Applicants fetcher={posterQuery} />
                                </>
                            )}
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 5 }} active />
                            <Skeleton.Image active />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(posterQuery.error as any)?.message || posterQuery.error} />
                        </State.Error>
                    </>
                )}
            </State>
        </Layout>
    );
}

export default DetailPost;
